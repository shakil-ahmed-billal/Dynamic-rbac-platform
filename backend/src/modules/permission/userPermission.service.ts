/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

/**
 * Get effective permissions of a user (role defaults + user overrides).
 * This is the single source of truth for what a user CAN do.
 */
const getEffectivePermissions = async (userId: string) => {
  // 1. Role-based permissions
  const userWithRoles = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: { include: { module: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userWithRoles) return [];

  const effectivePermissions = new Map<string, any>();

  userWithRoles.userRoles.forEach((ur) => {
    ur.role.rolePermissions.forEach((rp) => {
      const p = rp.permission;
      const key = `${p.module.slug}.${p.action}`;
      effectivePermissions.set(key, {
        id: p.id,
        action: p.action,
        moduleId: p.moduleId,
        moduleName: p.module.name,
        moduleSlug: p.module.slug,
      });
    });
  });

  // 2. Apply user-specific overrides
  const userOverrides = await prisma.userPermission.findMany({
    where: { userId },
    include: { permission: { include: { module: true } } },
  });

  userOverrides.forEach((override) => {
    const p = override.permission;
    const key = `${p.module.slug}.${p.action}`;
    if (override.granted) {
      effectivePermissions.set(key, {
        id: p.id,
        action: p.action,
        moduleId: p.moduleId,
        moduleName: p.module.name,
        moduleSlug: p.module.slug,
      });
    } else {
      effectivePermissions.delete(key);
    }
  });

  return Array.from(effectivePermissions.values());
};

/**
 * Grant a permission to a specific user.
 * Validates grant ceiling: the granter must themselves have the permission.
 */
const grantPermission = async (
  granterId: string,
  targetUserId: string,
  permissionId: string,
) => {
  // 1. Validate target user exists
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new AppError(status.NOT_FOUND, 'Target user not found.');
  }

  // 2. Validate permission exists
  const permission = await prisma.permission.findUnique({
    where: { id: permissionId },
    include: { module: true },
  });
  if (!permission) {
    throw new AppError(status.NOT_FOUND, 'Permission not found.');
  }

  // 3. Grant ceiling check: granter must have this permission (unless superAdmin)
  const granter = await prisma.user.findUnique({ where: { id: granterId } });
  if (!granter?.isSuperAdmin) {
    const granterPermissions = await getEffectivePermissions(granterId);
    const granterKey = `${permission.module.name}.${permission.action}`;
    const hasPermission = granterPermissions.some(
      (p) => `${p.moduleName}.${p.action}` === granterKey,
    );
    if (!hasPermission) {
      throw new AppError(
        status.FORBIDDEN,
        'You cannot grant a permission you do not have yourself.',
      );
    }
  }

  // 4. Upsert user permission as granted
  const userPermission = await prisma.userPermission.upsert({
    where: { userId_permissionId: { userId: targetUserId, permissionId } },
    update: { granted: true, grantedBy: granterId },
    create: { userId: targetUserId, permissionId, granted: true, grantedBy: granterId },
  });

  return userPermission;
};

/**
 * Revoke a permission from a specific user.
 */
const revokePermission = async (
  granterId: string,
  targetUserId: string,
  permissionId: string,
) => {
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new AppError(status.NOT_FOUND, 'Target user not found.');
  }

  const permission = await prisma.permission.findUnique({
    where: { id: permissionId },
    include: { module: true },
  });
  if (!permission) {
    throw new AppError(status.NOT_FOUND, 'Permission not found.');
  }

  // Grant ceiling check for revoke as well
  const granter = await prisma.user.findUnique({ where: { id: granterId } });
  if (!granter?.isSuperAdmin) {
    const granterPermissions = await getEffectivePermissions(granterId);
    const granterKey = `${permission.module.name}.${permission.action}`;
    const hasPermission = granterPermissions.some(
      (p) => `${p.moduleName}.${p.action}` === granterKey,
    );
    if (!hasPermission) {
      throw new AppError(
        status.FORBIDDEN,
        'You cannot revoke a permission you do not have yourself.',
      );
    }
  }

  const userPermission = await prisma.userPermission.upsert({
    where: { userId_permissionId: { userId: targetUserId, permissionId } },
    update: { granted: false, grantedBy: granterId },
    create: { userId: targetUserId, permissionId, granted: false, grantedBy: granterId },
  });

  return userPermission;
};

/**
 * Get all user-specific permission overrides for a given user.
 */
const getUserPermissions = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  const userPermissions = await prisma.userPermission.findMany({
    where: { userId },
    include: { permission: { include: { module: true } } },
  });

  return userPermissions;
};

export const UserPermissionService = {
  getEffectivePermissions,
  grantPermission,
  revokePermission,
  getUserPermissions,
};
