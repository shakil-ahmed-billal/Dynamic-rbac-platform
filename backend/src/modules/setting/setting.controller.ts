import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { SystemSettingService } from './setting.service';

const createSetting = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemSettingService.createSetting(req.body, req.user!);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'System setting created successfully.',
    data: result,
  });
});

const getAllSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemSettingService.getAllSettings(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'System settings retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getSettingByKey = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemSettingService.getSettingByKey(req.params.key as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'System setting retrieved successfully.',
    data: result,
  });
});

const updateSetting = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemSettingService.updateSetting(req.params.key as string, req.body, req.user!);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'System setting updated successfully.',
    data: result,
  });
});

const deleteSetting = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemSettingService.deleteSetting(req.params.key as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'System setting deleted successfully.',
    data: result,
  });
});

const getPublicSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SystemSettingService.getPublicSettings();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Public settings retrieved successfully.',
    data: result,
  });
});

export const SystemSettingController = {
  createSetting,
  getAllSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
  getPublicSettings,
};
