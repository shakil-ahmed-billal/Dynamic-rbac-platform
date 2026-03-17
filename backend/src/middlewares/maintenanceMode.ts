import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { prisma } from '../lib/prisma';
import AppError from '../errors/AppError';

export const checkMaintenanceMode = async (
  req: Request,
  res: Response,
  Next: NextFunction,
) => {
  // Exception for public settings route so we can show maintenance page properly
  if (req.originalUrl === '/api/v1/settings/public' || req.path === '/public') {
    return Next();
  }

  const maintenanceSetting = await prisma.systemSetting.findUnique({
    where: { key: 'maintenance_mode' },
  });

  if (maintenanceSetting?.value === 'true') {
    // Exception for SuperAdmins so they can fix settings
    if (req.user?.isSuperAdmin) {
      return Next();
    }

    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      'System is under maintenance. Please try again later.',
    );
  }

  Next();
};
