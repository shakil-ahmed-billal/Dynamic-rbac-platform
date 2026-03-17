/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import {
  IAssignRolesPayload,
  ICreateUserPayload,
  IUpdateUserPayload,
  IUpdateUserStatusPayload,
} from './user.interface';

const userSelect = {
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
};

const createUser = async (payload: ICreateUserPayload & { roleId?: string }) => {
  const { roleId, ...userData } = payload;
  const existing = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existing) {
    throw new AppError(status.CONFLICT, 'User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { ...userData, password: hashedPassword },
      select: userSelect,
    });

    const targetRoleId = roleId || (await tx.role.findUnique({ where: { name: 'User' } }))?.id;

    if (targetRoleId) {
      await tx.userRole.create({
        data: { userId: newUser.id, roleId: targetRoleId },
      });
    }

    return newUser;
  });

  return user;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.user as any,
    query,
    {
      searchableFields: ['name', 'email', 'contactNumber'],
      filterableFields: ['status', 'gender', 'isSuperAdmin'],
    },
  )
    .search()
    .filter()
    .where({ isDeleted: false })
    .sort()
    .paginate()
    .include({
      userRoles: {
        include: {
          role: true,
        },
      },
    })
    .execute();

  // Map userRoles to a singular role and roleId for frontend compatibility
  result.data = result.data.map((user: any) => ({
    ...user,
    roleId: user.userRoles?.[0]?.roleId || null,
    role: user.userRoles?.[0]?.role || null,
  }));

  return result;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      ...userSelect,
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: { include: { module: true } } },
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

  // Map userRoles to a singular role and roleId for frontend compatibility
  return {
    ...user,
    roleId: (user as any).userRoles?.[0]?.roleId || null,
    role: (user as any).userRoles?.[0]?.role || null,
  };
};

const updateUser = async (id: string, payload: IUpdateUserPayload, requestUser: IRequestUser) => {
  // Users can only update their own profiles unless they're super admin
  if (!requestUser.isSuperAdmin && requestUser.id !== id) {
    throw new AppError(status.FORBIDDEN, 'You can only update your own profile.');
  }

  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  const { roleId, ...userData } = payload;

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id },
      data: userData,
      select: userSelect,
    });

    if (roleId) {
      // For this simple case, we replace all existing roles with the new one
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.create({
        data: {
          userId: id,
          roleId: roleId,
        },
      });
    }

    return updatedUser;
  });

  return result;
};

const updateUserStatus = async (id: string, payload: IUpdateUserStatusPayload) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  if (user.isSuperAdmin) {
    throw new AppError(status.FORBIDDEN, 'Cannot change the status of a super admin.');
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: payload.status },
    select: userSelect,
  });

  return updated;
};

const softDeleteUser = async (id: string) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  if (user.isSuperAdmin) {
    throw new AppError(status.FORBIDDEN, 'Cannot delete a super admin.');
  }

  const deleted = await prisma.user.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date(), status: 'DELETED' },
    select: userSelect,
  });

  return deleted;
};

const assignRolesToUser = async (id: string, payload: IAssignRolesPayload) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  const roles = await prisma.role.findMany({ where: { id: { in: payload.roleIds } } });
  if (roles.length !== payload.roleIds.length) {
    throw new AppError(status.NOT_FOUND, 'One or more roles not found.');
  }

  // Upsert user roles (add new ones only)
  await prisma.$transaction(
    payload.roleIds.map((roleId) =>
      prisma.userRole.upsert({
        where: { userId_roleId: { userId: id, roleId } },
        update: {},
        create: { userId: id, roleId },
      }),
    ),
  );

  return getUserById(id);
};

const removeRolesFromUser = async (id: string, payload: IAssignRolesPayload) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false } });
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  await prisma.userRole.deleteMany({
    where: { userId: id, roleId: { in: payload.roleIds } },
  });

  return getUserById(id);
};

const getMinimalUsers = async () => {
  return await prisma.user.findMany({
    where: { isDeleted: false, status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  softDeleteUser,
  assignRolesToUser,
  removeRolesFromUser,
  getMinimalUsers,
};
