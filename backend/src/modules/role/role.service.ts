/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { ICreateRolePayload, IUpdateRolePayload, IAssignPermissionsPayload } from './role.interface';

const roleInclude = {
  rolePermissions: {
    include: {
      permission: {
        include: { module: true },
      },
    },
  },
  _count: { select: { userRoles: true } },
};

const createRole = async (payload: ICreateRolePayload) => {
  const existingRole = await prisma.role.findUnique({ where: { name: payload.name } });
  if (existingRole) {
    throw new AppError(status.CONFLICT, `Role with name "${payload.name}" already exists.`);
  }

  const role = await prisma.role.create({
    data: payload,
    include: roleInclude,
  });

  return role;
};

const getAllRoles = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.role as any,
    query,
    {
      searchableFields: ['name', 'description'],
      filterableFields: ['isActive'],
    },
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();

  return result;
};

const getRoleById = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: roleInclude,
  });

  if (!role) {
    throw new AppError(status.NOT_FOUND, 'Role not found.');
  }

  return role;
};

const updateRole = async (id: string, payload: IUpdateRolePayload) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError(status.NOT_FOUND, 'Role not found.');
  }

  if (role.isSystem && (payload.name || payload.isActive === false)) {
    throw new AppError(status.FORBIDDEN, 'System roles cannot be modified.');
  }

  if (payload.name) {
    const duplicate = await prisma.role.findFirst({
      where: { name: payload.name, id: { not: id } },
    });
    if (duplicate) {
      throw new AppError(status.CONFLICT, `Role with name "${payload.name}" already exists.`);
    }
  }

  const updated = await prisma.role.update({
    where: { id },
    data: payload,
    include: roleInclude,
  });

  return updated;
};

const deleteRole = async (id: string) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError(status.NOT_FOUND, 'Role not found.');
  }

  if (role.isSystem) {
    throw new AppError(status.FORBIDDEN, 'System roles cannot be deleted.');
  }

  await prisma.role.delete({ where: { id } });

  return { message: 'Role deleted successfully.' };
};

const assignPermissionsToRole = async (id: string, payload: IAssignPermissionsPayload) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError(status.NOT_FOUND, 'Role not found.');
  }

  // Validate all permissions exist
  const permissions = await prisma.permission.findMany({
    where: { id: { in: payload.permissionIds } },
  });

  if (permissions.length !== payload.permissionIds.length) {
    throw new AppError(status.NOT_FOUND, 'One or more permissions not found.');
  }

  // Remove old permissions and reassign
  await prisma.$transaction(async (tx: any) => {
    await tx.rolePermission.deleteMany({ where: { roleId: id } });

    await tx.rolePermission.createMany({
      data: payload.permissionIds.map((permissionId) => ({
        roleId: id,
        permissionId,
      })),
    });
  });

  return prisma.role.findUnique({ where: { id }, include: roleInclude });
};

const removePermissionsFromRole = async (id: string, payload: IAssignPermissionsPayload) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError(status.NOT_FOUND, 'Role not found.');
  }

  await prisma.rolePermission.deleteMany({
    where: { roleId: id, permissionId: { in: payload.permissionIds } },
  });

  return prisma.role.findUnique({ where: { id }, include: roleInclude });
};

export const RoleService = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
  removePermissionsFromRole,
};
