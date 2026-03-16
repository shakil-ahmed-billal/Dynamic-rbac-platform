import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { AdminController } from './admin.controller';

const router = Router();

router.get(
  '/dashboard-stats',
  checkAuth({ requireSuperAdmin: true }),
  AdminController.getDashboardStats,
);

export const AdminRoutes = router;
