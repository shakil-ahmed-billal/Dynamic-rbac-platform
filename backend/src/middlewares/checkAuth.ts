/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import envVars from '../config';
import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { CookieUtils } from '../utils/cookie';
import { jwtUtils } from '../utils/jwt';

/**
 * checkAuth middleware
 * Usage:
 *   checkAuth()                              → any authenticated user
 *   checkAuth({ requireSuperAdmin: true })   → super admin only
 *   checkAuth({ roles: ['Admin'] })          → must have one of these role names
 *   checkAuth({ permissions: [{ module: 'users', action: 'READ' }] }) → must have this permission
 */

interface CheckAuthOptions {
  requireSuperAdmin?: boolean;
  roles?: string[];
  permissions?: { module: string; action: string }[];
  permissionMode?: 'ALL' | 'ANY';
}

export const checkAuth = (options: CheckAuthOptions = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        CookieUtils.getCookie(req, 'accessToken') ||
        (req.headers.authorization?.startsWith('Bearer ')
          ? req.headers.authorization.split(' ')[1]
          : undefined);

      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
      }

      const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

      if (!verifiedToken.success || !verifiedToken.data) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid or expired access token.');
      }

      const { userId } = verifiedToken.data;

      // Fetch user with roles and permissions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: {
                        include: { module: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User not found.');
      }

      if (user.status === 'BLOCKED') {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is blocked.');
      }

      if (user.isDeleted || user.status === 'DELETED') {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User account is deleted.');
      }

      const userRoleNames = user.userRoles.map((ur: any) => ur.role.name);

      // Set user on request
      req.user = {
        id: user.id,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        roles: userRoleNames,
        status: user.status,
      };

      // Super admin bypass (super admin has access to everything)
      if (user.isSuperAdmin) {
        return next();
      }

      // requireSuperAdmin check
      if (options.requireSuperAdmin) {
        throw new AppError(status.FORBIDDEN, 'Forbidden! Super admin access required.');
      }

      // Role check
      if (options.roles && options.roles.length > 0) {
        const hasRole = userRoleNames.some((roleName: string) => options.roles!.includes(roleName));
        if (!hasRole) {
          throw new AppError(
            status.FORBIDDEN,
            `Forbidden! Required role(s): ${options.roles.join(', ')}.`,
          );
        }
      }

      // Permission check — using effective permissions (role defaults + user-level overrides)
      if (options.permissions && options.permissions.length > 0) {
        const rolePermissionsMap = new Map<string, boolean>();
        
        // 1. Role-based permissions
        user.userRoles.forEach((ur: any) => {
          ur.role.rolePermissions.forEach((rp: any) => {
            if (rp.permission?.module?.slug) {
              const key = `${rp.permission.module.slug}.${rp.permission.action.toUpperCase()}`;
              rolePermissionsMap.set(key, true);
            }
          });
        });

        // 2. Apply user-specific overrides
        const userOverrides = await prisma.userPermission.findMany({
          where: { userId: user.id },
          include: { permission: { include: { module: true } } },
        });

        userOverrides.forEach((override: any) => {
          if (override.permission?.module?.slug) {
            const key = `${override.permission.module.slug}.${override.permission.action.toUpperCase()}`;
            if (override.granted) {
              rolePermissionsMap.set(key, true);
            } else {
              rolePermissionsMap.delete(key);
            }
          }
        });

        const isAllowed = options.permissionMode === 'ANY'
          ? options.permissions.some((p) => rolePermissionsMap.has(`${p.module}.${p.action.toUpperCase()}`))
          : options.permissions.every((p) => rolePermissionsMap.has(`${p.module}.${p.action.toUpperCase()}`));

        console.log(`[DEBUG] Permission Check:`);
        console.log(` - User: ${user.email}`);
        console.log(` - Required: ${JSON.stringify(options.permissions)} (Mode: ${options.permissionMode || 'ALL'})`);
        console.log(` - Effective Keys: ${Array.from(rolePermissionsMap.keys()).join(', ')}`);
        console.log(` - Result: ${isAllowed}`);

        if (!isAllowed) {
          throw new AppError(status.FORBIDDEN, 'Forbidden! Insufficient permissions.');
        }
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
