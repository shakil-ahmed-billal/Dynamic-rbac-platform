/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { ICreateLeadPayload, IUpdateLeadPayload } from './lead.interface';

const createLead = async (payload: ICreateLeadPayload) => {
  const result = await prisma.lead.create({
    data: payload as any,
  });
  return result;
};

const getAllLeads = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.lead as any,
    query,
    {
      searchableFields: ['name', 'email', 'company', 'phone'],
      filterableFields: ['status', 'source'],
    },
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ assignee: { select: { id: true, name: true, email: true } } })
    .execute();

  result.data = result.data.map((lead: any) => ({
    ...lead,
    assignedToUser: lead.assignee || null,
  }));

  return result;
};

const getLeadById = async (id: string) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { assignee: { select: { id: true, name: true, email: true } } },
  });

  if (!lead) {
    throw new AppError(status.NOT_FOUND, 'Lead not found.');
  }

  return {
    ...lead,
    assignedToUser: (lead as any).assignee || null,
  };
};

const updateLead = async (id: string, payload: IUpdateLeadPayload) => {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    throw new AppError(status.NOT_FOUND, 'Lead not found.');
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: payload as any,
  });

  return updated;
};

const deleteLead = async (id: string) => {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    throw new AppError(status.NOT_FOUND, 'Lead not found.');
  }

  const deleted = await prisma.lead.delete({
    where: { id },
  });

  return deleted;
};

export const LeadService = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
