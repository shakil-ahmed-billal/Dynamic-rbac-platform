/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import envVars from '../../config';
import AppError from '../../errors/AppError';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { jwtUtils } from '../../utils/jwt';
import { tokenUtils } from '../../utils/token';
import {
  IChangePasswordPayload,
  ILoginPayload,
  IRegisterPayload,
} from './auth.interface';

const getResolvedPermissions = async (userId: string) => {
  // 1. Get permissions from all roles
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
  
  // 1. Roll up role permissions
  userWithRoles.userRoles.forEach((ur) => {
    ur.role.rolePermissions.forEach((rp) => {
      const p = rp.permission;
      const key = `${p.module.slug}.${p.action.toUpperCase()}`;
      effectivePermissions.set(key, {
        id: p.id,
        action: p.action,
        moduleId: p.moduleId,
        moduleName: p.module.name,
        moduleSlug: p.module.slug,
      });
    });
  });

  // 2. Get user specific overrides
  const userOverrides = await prisma.userPermission.findMany({
    where: { userId },
    include: {
      permission: { include: { module: true } },
    },
  });

  userOverrides.forEach((override) => {
    const p = override.permission;
    const key = `${p.module.slug}.${p.action.toUpperCase()}`;
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


const register = async (payload: IRegisterPayload) => {
  const { name, email, password } = payload;

  const registrationSetting = await prisma.systemSetting.findUnique({
    where: { key: 'allow_registration' },
  });

  if (registrationSetting?.value === 'false') {
    throw new AppError(status.FORBIDDEN, 'Public registration is currently disabled.');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(status.CONFLICT, 'User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { name, email, password: hashedPassword },
    });

    const userRole = await tx.role.findUnique({ where: { name: 'User' } });
    if (userRole) {
      await tx.userRole.create({
        data: { userId: newUser.id, roleId: userRole.id },
      });
    }

    return newUser;
  });

  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'No user found with this email.');
  }

  if (user.isDeleted || user.status === 'DELETED') {
    throw new AppError(status.NOT_FOUND, 'User account is deleted.');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(status.FORBIDDEN, 'User account is blocked. Contact support.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, 'Incorrect password.');
  }

  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

const getMe = async (requestUser: IRequestUser) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      gender: true,
      contactNumber: true,
      address: true,
      status: true,
      isSuperAdmin: true,
      needPasswordChange: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
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

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  const permissions = await getResolvedPermissions(user.id);

  return { ...user, permissions };
};


const refreshToken = async (token: string) => {
  const verifiedToken = jwtUtils.verifyToken(token, envVars.REFRESH_TOKEN_SECRET);

  if (!verifiedToken.success || !verifiedToken.data) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid or expired refresh token.');
  }

  const data = verifiedToken.data as JwtPayload;

  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user || user.isDeleted || user.status !== 'ACTIVE') {
    throw new AppError(status.UNAUTHORIZED, 'User is not active.');
  }

  const tokenPayload = { userId: user.id, email: user.email };
  const newAccessToken = tokenUtils.getAccessToken(tokenPayload);
  const newRefreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const changePassword = async (
  requestUser: IRequestUser,
  payload: IChangePasswordPayload,
) => {
  const user = await prisma.user.findUnique({ where: { id: requestUser.id } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  const isPasswordMatch = await bcrypt.compare(payload.currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, 'Current password is incorrect.');
  }

  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedNewPassword,
      needPasswordChange: false,
    },
  });

  return { message: 'Password changed successfully.' };
};

const logout = async () => {
  return { message: 'Logged out successfully.' };
};

export const AuthService = {
  register,
  login,
  getMe,
  refreshToken,
  changePassword,
  logout,
};
