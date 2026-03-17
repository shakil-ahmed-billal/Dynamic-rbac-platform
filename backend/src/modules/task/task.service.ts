/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { ICreateTaskPayload, IUpdateTaskPayload } from './task.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';

const createTask = async (payload: ICreateTaskPayload, user: IRequestUser) => {
  const result = await prisma.task.create({
    data: {
      ...payload,
      createdBy: user.id,
    } as any,
  });
  return result;
};

const getAllTasks = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(
    prisma.task as any,
    query,
    {
      searchableFields: ['title', 'description'],
      filterableFields: ['status'],
    },
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ assignee: { select: { id: true, name: true, email: true } } })
    .execute();

  result.data = result.data.map((task: any) => ({
    ...task,
    assignedToUser: task.assignee || null,
  }));

  return result;
};

const getTaskById = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { assignee: { select: { id: true, name: true, email: true } }, creator: { select: { id: true, name: true, email: true } } },
  });

  if (!task) {
    throw new AppError(status.NOT_FOUND, 'Task not found.');
  }

  return {
    ...task,
    assignedToUser: (task as any).assignee || null,
  };
};

const updateTask = async (id: string, payload: IUpdateTaskPayload) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new AppError(status.NOT_FOUND, 'Task not found.');
  }

  const updated = await prisma.task.update({
    where: { id },
    data: payload as any,
  });

  return updated;
};

const deleteTask = async (id: string) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new AppError(status.NOT_FOUND, 'Task not found.');
  }

  const deleted = await prisma.task.delete({
    where: { id },
  });

  return deleted;
};

export const TaskService = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
