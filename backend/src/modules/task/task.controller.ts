import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { TaskService } from './task.service';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.createTask(req.body, req.user!);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Task created successfully.',
    data: result,
  });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getAllTasks(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Tasks retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getTaskById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Task retrieved successfully.',
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.updateTask(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Task updated successfully.',
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.deleteTask(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Task deleted successfully.',
    data: result,
  });
});

export const TaskController = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
