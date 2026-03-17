import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { AuditLogController } from './auditLog.controller';

const router = Router();

router.get(
  '/',
  checkAuth({
    permissions: [
      { module: 'audit-logs', action: 'READ' },
      { module: 'dashboard', action: 'READ' },
    ],
    permissionMode: 'ANY',
  }),
  AuditLogController.getAllAuditLogs,
);

router.get(
  '/:id',
  checkAuth({ permissions: [{ module: 'audit-logs', action: 'READ' }] }),
  AuditLogController.getAuditLogById,
);

export const AuditLogRoutes = router;
