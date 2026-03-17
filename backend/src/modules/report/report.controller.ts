import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReportService } from "./report.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const { id, isSuperAdmin } = (req as any).user;
  const result = await ReportService.getDashboardStats(id, isSuperAdmin);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Dashboard stats retrieved successfully.",
    data: result,
  });
});

export const ReportController = {
  getDashboardStats,
};
