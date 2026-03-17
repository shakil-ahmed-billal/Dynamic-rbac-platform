/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { ICreatePermissionPayload, IUpdatePermissionPayload } from './permission.interface';

const permissionInclude = {
  module: true,
};

const createPermission = async (payload: ICreatePermissionPayload) => {
  const module = await prisma.systemModule.findUnique({ where: { id: payload.moduleId } });
  if (!module) {
    throw new AppError(status.NOT_FOUND, 'System module not found.');
  }

  const existing = await prisma.permission.findUnique({
    where: { action_moduleId: { action: payload.action, moduleId: payload.moduleId } },
  });
  if (existing) {
    throw new AppError(
      status.CONFLICT,
      `Permission "${payload.action}" for module "${module.name}" already exists.`,
    );
  }

  const permission = await prisma.permission.create({
    data: payload,
    include: permissionInclude,
  });

  return permission;
};

const getAllPermissions = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.permission as any,
    query,
    {
      filterableFields: ['action', 'moduleId', 'name', 'slug'],
    },
  )
    .filter()
    .sort()
    .paginate()
    .include(permissionInclude)
    .execute();

  return result;
};

const getPermissionById = async (id: string) => {
  const permission = await prisma.permission.findUnique({
    where: { id },
    include: permissionInclude,
  });

  if (!permission) {
    throw new AppError(status.NOT_FOUND, 'Permission not found.');
  }

  return permission;
};

const updatePermission = async (id: string, payload: IUpdatePermissionPayload) => {
  const permission = await prisma.permission.findUnique({ where: { id } });
  if (!permission) {
    throw new AppError(status.NOT_FOUND, 'Permission not found.');
  }

  if (payload.moduleId) {
    const module = await prisma.systemModule.findUnique({ where: { id: payload.moduleId } });
    if (!module) {
      throw new AppError(status.NOT_FOUND, 'System module not found.');
    }
  }

  const updated = await prisma.permission.update({
    where: { id },
    data: payload,
    include: permissionInclude,
  });

  return updated;
};

const deletePermission = async (id: string) => {
  const permission = await prisma.permission.findUnique({ where: { id } });
  if (!permission) {
    throw new AppError(status.NOT_FOUND, 'Permission not found.');
  }

  await prisma.permission.delete({ where: { id } });

  return { message: 'Permission deleted successfully.' };
};

export const PermissionService = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
};
