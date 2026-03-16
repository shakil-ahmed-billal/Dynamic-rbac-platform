import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { RoleController } from './role.controller';
import {
  assignPermissionsZodSchema,
  createRoleZodSchema,
  updateRoleZodSchema,
} from './role.validation';

const router = Router();

router.post(
  '/',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createRoleZodSchema),
  RoleController.createRole,
);

router.get(
  '/',
  checkAuth({ permissions: [{ module: 'roles', action: 'READ' }] }),
  RoleController.getAllRoles,
);

router.get(
  '/:id',
  checkAuth({ permissions: [{ module: 'roles', action: 'READ' }] }),
  RoleController.getRoleById,
);

router.patch(
  '/:id',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updateRoleZodSchema),
  RoleController.updateRole,
);

router.delete(
  '/:id',
  checkAuth({ requireSuperAdmin: true }),
  RoleController.deleteRole,
);

router.post(
  '/:id/permissions',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignPermissionsZodSchema),
  RoleController.assignPermissionsToRole,
);

router.delete(
  '/:id/permissions',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignPermissionsZodSchema),
  RoleController.removePermissionsFromRole,
);

export const RoleRoutes = router;
