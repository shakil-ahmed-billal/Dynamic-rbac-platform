import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PermissionService } from './permission.service';

const createPermission = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.createPermission(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Permission created successfully.',
    data: result,
  });
});

const getAllPermissions = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.getAllPermissions(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permissions retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getPermissionById = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.getPermissionById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permission retrieved successfully.',
    data: result,
  });
});

const updatePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.updatePermission(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permission updated successfully.',
    data: result,
  });
});

const deletePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.deletePermission(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const PermissionController = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
};
