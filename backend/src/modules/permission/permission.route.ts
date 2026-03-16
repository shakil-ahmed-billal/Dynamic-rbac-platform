import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { PermissionController } from './permission.controller';
import { createPermissionZodSchema, updatePermissionZodSchema } from './permission.validation';

const router = Router();

router.post(
  '/',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createPermissionZodSchema),
  PermissionController.createPermission,
);

router.get(
  '/',
  checkAuth({ permissions: [{ module: 'permissions', action: 'READ' }] }),
  PermissionController.getAllPermissions,
);

router.get(
  '/:id',
  checkAuth({ permissions: [{ module: 'permissions', action: 'READ' }] }),
  PermissionController.getPermissionById,
);

router.patch(
  '/:id',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updatePermissionZodSchema),
  PermissionController.updatePermission,
);

router.delete(
  '/:id',
  checkAuth({ requireSuperAdmin: true }),
  PermissionController.deletePermission,
);

export const PermissionRoutes = router;
