import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { LeadService } from './lead.service';

const createLead = catchAsync(async (req: Request, res: Response) => {
  const result = await LeadService.createLead(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Lead created successfully.',
    data: result,
  });
});

const getAllLeads = catchAsync(async (req: Request, res: Response) => {
  const result = await LeadService.getAllLeads(req.query);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Leads retrieved successfully.',
    data: result.data,
    meta: result.meta,
  });
});

const getLeadById = catchAsync(async (req: Request, res: Response) => {
  const result = await LeadService.getLeadById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Lead retrieved successfully.',
    data: result,
  });
});

const updateLead = catchAsync(async (req: Request, res: Response) => {
  const result = await LeadService.updateLead(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Lead updated successfully.',
    data: result,
  });
});

const deleteLead = catchAsync(async (req: Request, res: Response) => {
  const result = await LeadService.deleteLead(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Lead deleted successfully.',
    data: result,
  });
});

export const LeadController = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
