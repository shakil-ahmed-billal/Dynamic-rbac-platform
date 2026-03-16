/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { ICreateSystemModulePayload, IUpdateSystemModulePayload } from './systemModule.interface';

const createSystemModule = async (payload: ICreateSystemModulePayload) => {
  const existing = await prisma.systemModule.findUnique({ where: { name: payload.name } });
  if (existing) {
    throw new AppError(status.CONFLICT, `Module with name "${payload.name}" already exists.`);
  }

  const module = await prisma.systemModule.create({
    data: payload,
    include: { permissions: true },
  });

  return module;
};

const getAllSystemModules = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.systemModule as any,
    query,
    { searchableFields: ['name', 'description'], filterableFields: ['isActive'] },
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();

  return result;
};

const getSystemModuleById = async (id: string) => {
  const module = await prisma.systemModule.findUnique({
    where: { id },
    include: { permissions: true },
  });
  if (!module) {
    throw new AppError(status.NOT_FOUND, 'System module not found.');
  }
  return module;
};

const updateSystemModule = async (id: string, payload: IUpdateSystemModulePayload) => {
  const module = await prisma.systemModule.findUnique({ where: { id } });
  if (!module) {
    throw new AppError(status.NOT_FOUND, 'System module not found.');
  }

  if (payload.name && payload.name !== module.name) {
    const duplicate = await prisma.systemModule.findFirst({
      where: { name: payload.name, id: { not: id } },
    });
    if (duplicate) {
      throw new AppError(status.CONFLICT, `Module with name "${payload.name}" already exists.`);
    }
  }

  const updated = await prisma.systemModule.update({
    where: { id },
    data: payload,
    include: { permissions: true },
  });

  return updated;
};

const deleteSystemModule = async (id: string) => {
  const module = await prisma.systemModule.findUnique({ where: { id } });
  if (!module) {
    throw new AppError(status.NOT_FOUND, 'System module not found.');
  }

  await prisma.systemModule.delete({ where: { id } });
  return { message: 'System module deleted successfully.' };
};

export const SystemModuleService = {
  createSystemModule,
  getAllSystemModules,
  getSystemModuleById,
  updateSystemModule,
  deleteSystemModule,
};
