import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserPermissionController } from './userPermission.controller';

const router = Router();

// GET /user-permissions/:userId - get user's permission overrides
router.get(
  '/:userId',
  checkAuth({ permissions: [{ module: 'users', action: 'READ' }] }),
  UserPermissionController.getUserPermissions,
);

// GET /user-permissions/:userId/effective - get effective (resolved) permissions
router.get(
  '/:userId/effective',
  checkAuth({ permissions: [{ module: 'users', action: 'READ' }] }),
  UserPermissionController.getEffectivePermissions,
);

// POST /user-permissions/:userId/grant - grant a permission to a user
router.post(
  '/:userId/grant',
  checkAuth({ permissions: [{ module: 'users', action: 'MANAGE' }] }),
  UserPermissionController.grantPermission,
);

// POST /user-permissions/:userId/revoke - revoke a permission from a user
router.post(
  '/:userId/revoke',
  checkAuth({ permissions: [{ module: 'users', action: 'MANAGE' }] }),
  UserPermissionController.revokePermission,
);

export const UserPermissionRoutes = router;
