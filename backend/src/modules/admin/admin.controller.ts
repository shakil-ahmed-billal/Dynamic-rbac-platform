import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully.',
    data: result,
  });
});

export const AdminController = {
  getDashboardStats,
};
