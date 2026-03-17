import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserPermissionService } from './userPermission.service';

const grantPermission = catchAsync(async (req: Request, res: Response) => {
  const granterId = req.user!.id;
  const targetUserId = req.params.userId as string;
  const { permissionId } = req.body;

  const result = await UserPermissionService.grantPermission(granterId, targetUserId, permissionId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permission granted successfully.',
    data: result,
  });
});

const revokePermission = catchAsync(async (req: Request, res: Response) => {
  const granterId = req.user!.id;
  const targetUserId = req.params.userId as string;
  const { permissionId } = req.body;

  const result = await UserPermissionService.revokePermission(granterId, targetUserId, permissionId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Permission revoked successfully.',
    data: result,
  });
});

const getUserPermissions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await UserPermissionService.getUserPermissions(userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User permissions fetched successfully.',
    data: result,
  });
});

const getEffectivePermissions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await UserPermissionService.getEffectivePermissions(userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Effective permissions fetched successfully.',
    data: result,
  });
});

export const UserPermissionController = {
  grantPermission,
  revokePermission,
  getUserPermissions,
  getEffectivePermissions,
};
