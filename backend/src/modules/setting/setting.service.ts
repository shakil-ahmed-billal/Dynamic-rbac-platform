/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { ICreateSystemSettingPayload, IUpdateSystemSettingPayload } from './setting.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';

const createSetting = async (payload: ICreateSystemSettingPayload, user: IRequestUser) => {
  const existing = await prisma.systemSetting.findUnique({ where: { key: payload.key } });
  if (existing) {
    throw new AppError(status.CONFLICT, 'System setting with this key already exists.');
  }

  const result = await prisma.systemSetting.create({
    data: {
      ...payload,
      updatedBy: user.id,
    } as any,
  });
  return result;
};

const getAllSettings = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.systemSetting as any,
    query,
    {
      searchableFields: ['key', 'value', 'description'],
      filterableFields: [],
    },
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();

  return result;
};

const getSettingByKey = async (key: string) => {
  const setting = await prisma.systemSetting.findUnique({
    where: { key },
    include: { updater: { select: { id: true, name: true, email: true } } },
  });

  if (!setting) {
    throw new AppError(status.NOT_FOUND, 'System setting not found.');
  }

  return setting;
};

const updateSetting = async (idOrKey: string, payload: IUpdateSystemSettingPayload, user: IRequestUser) => {
  const setting = await prisma.systemSetting.findFirst({
    where: {
      OR: [{ key: idOrKey }, { id: idOrKey }],
    },
  });

  if (!setting) {
    throw new AppError(status.NOT_FOUND, 'System setting not found.');
  }

  const updated = await prisma.systemSetting.update({
    where: { id: setting.id },
    data: {
      ...payload,
      updatedBy: user.id,
    } as any,
  });

  return updated;
};

const deleteSetting = async (idOrKey: string) => {
  const setting = await prisma.systemSetting.findFirst({
    where: {
      OR: [{ key: idOrKey }, { id: idOrKey }],
    },
  });

  if (!setting) {
    throw new AppError(status.NOT_FOUND, 'System setting not found.');
  }

  const deleted = await prisma.systemSetting.delete({
    where: { id: setting.id },
  });

  return deleted;
};

const getPublicSettings = async () => {
  const publicKeys = ['site_name', 'allow_registration', 'maintenance_mode'];
  const settings = await prisma.systemSetting.findMany({
    where: { key: { in: publicKeys } },
  });

  const result: Record<string, string> = {};
  settings.forEach((s) => {
    result[s.key] = s.value;
  });

  return result;
};

export const SystemSettingService = {
  createSetting,
  getAllSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
  getPublicSettings,
};
