/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';

const getAllAuditLogs = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.auditLog as any,
    query,
    {
      searchableFields: ['action', 'module', 'targetType'],
      filterableFields: ['userId', 'module', 'action', 'targetType'],
    },
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ user: { select: { id: true, name: true, email: true } } })
    .execute();

  return result;
};

const getAuditLogById = async (id: string) => {
  const log = await prisma.auditLog.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return log;
};

const createAuditLog = async (data: {
  userId?: string;
  action: string;
  module: string;
  targetId?: string;
  targetType?: string;
  oldData?: object;
  newData?: object;
  ipAddress?: string;
  userAgent?: string;
}) => {
  return prisma.auditLog.create({ data });
};

export const AuditLogService = {
  getAllAuditLogs,
  getAuditLogById,
  createAuditLog,
};
