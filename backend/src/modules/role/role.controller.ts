import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { RoleService } from './role.service';
import { AuditLogService } from '../auditLog/auditLog.service';

const createRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.createRole(req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'ROLE_CREATED',
    module: 'roles',
    targetId: (result as any).id,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Role created successfully.',
    data: result,
  });
});

const getAllRoles = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.getAllRoles(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Roles retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getRoleById = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.getRoleById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Role retrieved successfully.',
    data: result,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.updateRole(req.params.id as string, req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'ROLE_UPDATED',
    module: 'roles',
    targetId: req.params.id as string,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Role updated successfully.',
    data: result,
  });
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.deleteRole(req.params.id as string);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'ROLE_DELETED',
    module: 'roles',
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

const assignPermissionsToRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.assignPermissionsToRole(req.params.id as string, req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'PERMISSIONS_ASSIGNED_TO_ROLE',
    module: 'roles',
    targetId: req.params.id as string,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permissions assigned to role successfully.',
    data: result,
  });
});

const removePermissionsFromRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.removePermissionsFromRole(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permissions removed from role successfully.',
    data: result,
  });
});

export const RoleController = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
  removePermissionsFromRole,
};
