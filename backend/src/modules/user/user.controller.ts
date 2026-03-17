import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from './user.service';
import { AuditLogService } from '../auditLog/auditLog.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'USER_CREATED',
    module: 'users',
    targetId: result.id,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'User created successfully.',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User retrieved successfully.',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser(req.params.id as string, req.body, req.user!);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'USER_UPDATED',
    module: 'users',
    targetId: req.params.id as string,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User updated successfully.',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUserStatus(req.params.id as string, req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'USER_STATUS_UPDATED',
    module: 'users',
    targetId: req.params.id as string,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User status updated successfully.',
    data: result,
  });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.softDeleteUser(req.params.id as string);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'USER_DELETED',
    module: 'users',
    targetId: req.params.id as string,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User deleted successfully.',
    data: result,
  });
});

const assignRolesToUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.assignRolesToUser(req.params.id as string, req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'ROLES_ASSIGNED_TO_USER',
    module: 'users',
    targetId: req.params.id as string,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Roles assigned to user successfully.',
    data: result,
  });
});

const removeRolesFromUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.removeRolesFromUser(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Roles removed from user successfully.',
    data: result,
  });
});

const getMinimalUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMinimalUsers();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Minimal user list retrieved successfully.',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  softDeleteUser,
  assignRolesToUser,
  removeRolesFromUser,
  getMinimalUsers,
};
