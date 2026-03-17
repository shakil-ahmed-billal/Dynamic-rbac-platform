import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PermissionService } from './permission.service';
import { AuditLogService } from '../auditLog/auditLog.service';

const createPermission = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.createPermission(req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.userId,
    action: 'PERMISSION_CREATED',
    module: 'permissions',
    targetId: (result as any).id,
    newData: req.body,
    ipAddress: req.ip,
  });

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
  
  await AuditLogService.createAuditLog({
    userId: req.user!.userId,
    action: 'PERMISSION_UPDATED',
    module: 'permissions',
    targetId: req.params.id as string,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permission updated successfully.',
    data: result,
  });
});

const deletePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.deletePermission(req.params.id as string);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.userId,
    action: 'PERMISSION_DELETED',
    module: 'permissions',
    targetId: req.params.id as string,
    ipAddress: req.ip,
  });

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
