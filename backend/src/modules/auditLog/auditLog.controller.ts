import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuditLogService } from './auditLog.service';

const getAllAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await AuditLogService.getAllAuditLogs(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Audit logs retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getAuditLogById = catchAsync(async (req: Request, res: Response) => {
  const result = await AuditLogService.getAuditLogById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Audit log retrieved successfully.',
    data: result,
  });
});

export const AuditLogController = {
  getAllAuditLogs,
  getAuditLogById,
};
