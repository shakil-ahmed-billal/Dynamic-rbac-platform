import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { SystemModuleService } from './systemModule.service';
import { AuditLogService } from '../auditLog/auditLog.service';

const createSystemModule = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemModuleService.createSystemModule(req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'MODULE_CREATED',
    module: 'modules',
    targetId: (result as any).id,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'System module created successfully.',
    data: result,
  });
});

const getAllSystemModules = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemModuleService.getAllSystemModules(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'System modules retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getSystemModuleById = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemModuleService.getSystemModuleById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'System module retrieved successfully.',
    data: result,
  });
});

const updateSystemModule = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemModuleService.updateSystemModule(req.params.id as string, req.body);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'MODULE_UPDATED',
    module: 'modules',
    targetId: req.params.id as string,
    newData: req.body,
    ipAddress: req.ip,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'System module updated successfully.',
    data: result,
  });
});

const deleteSystemModule = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemModuleService.deleteSystemModule(req.params.id as string);
  
  await AuditLogService.createAuditLog({
    userId: req.user!.id,
    action: 'MODULE_DELETED',
    module: 'modules',
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

export const SystemModuleController = {
  createSystemModule,
  getAllSystemModules,
  getSystemModuleById,
  updateSystemModule,
  deleteSystemModule,
};
