import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { SystemModuleController } from './systemModule.controller';
import { createSystemModuleZodSchema, updateSystemModuleZodSchema } from './systemModule.validation';

const router = Router();

router.post(
  '/',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(createSystemModuleZodSchema),
  SystemModuleController.createSystemModule,
);

router.get(
  '/',
  checkAuth({ permissions: [{ module: 'modules', action: 'READ' }] }),
  SystemModuleController.getAllSystemModules,
);

router.get(
  '/:id',
  checkAuth({ permissions: [{ module: 'modules', action: 'READ' }] }),
  SystemModuleController.getSystemModuleById,
);

router.patch(
  '/:id',
  checkAuth({ requireSuperAdmin: true }),
  validateRequest(updateSystemModuleZodSchema),
  SystemModuleController.updateSystemModule,
);

router.delete(
  '/:id',
  checkAuth({ requireSuperAdmin: true }),
  SystemModuleController.deleteSystemModule,
);

export const SystemModuleRoutes = router;
