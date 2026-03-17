import express from 'express';
import { ReportController } from './report.controller';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.get(
  '/dashboard-stats',
  checkAuth({
    permissions: [
      { module: 'reports', action: 'READ' },
      { module: 'dashboard', action: 'READ' },
    ],
    permissionMode: 'ANY',
  }),
  ReportController.getDashboardStats,
);

export const ReportRoutes = router;
