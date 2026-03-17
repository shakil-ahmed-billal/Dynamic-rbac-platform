import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import {
  assignRolesZodSchema,
  createUserZodSchema,
  updateUserStatusZodSchema,
  updateUserZodSchema,
} from './user.validation';

const router = Router();

router.post(
  '/',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createUserZodSchema),
  UserController.createUser,
);

router.get(
  '/',
  checkAuth({ permissions: [{ module: 'users', action: 'READ' }] }),
  UserController.getAllUsers,
);

router.get(
  '/minimal',
  checkAuth(), // Any authenticated user can see names for assignment
  UserController.getMinimalUsers,
);

router.get(
  '/:id',
  checkAuth(),
  UserController.getUserById,
);

router.patch(
  '/:id',
  checkAuth(),
  validateRequest(updateUserZodSchema),
  UserController.updateUser,
);

router.patch(
  '/:id/status',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updateUserStatusZodSchema),
  UserController.updateUserStatus,
);

router.delete(
  '/:id',
  checkAuth({ requireSuperAdmin: true }),
  UserController.softDeleteUser,
);

router.post(
  '/:id/roles',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignRolesZodSchema),
  UserController.assignRolesToUser,
);

router.delete(
  '/:id/roles',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(assignRolesZodSchema),
  UserController.removeRolesFromUser,
);

export const UserRoutes = router;
