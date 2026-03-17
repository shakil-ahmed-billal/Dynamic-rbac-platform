import express from 'express';
import { SystemSettingController } from './setting.controller';
import { SystemSettingValidation } from './setting.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/public', SystemSettingController.getPublicSettings);

router.post(
  '/',
  checkAuth({ requireSuperAdmin: true }), // Only super admins can create settings
  validateRequest(SystemSettingValidation.createSystemSettingSchema),
  SystemSettingController.createSetting,
);

router.get(
  '/',
  checkAuth({ permissions: [{ module: 'settings', action: 'READ' }] }),
  SystemSettingController.getAllSettings,
);

router.get(
  '/:key',
  checkAuth({ permissions: [{ module: 'settings', action: 'READ' }] }),
  SystemSettingController.getSettingByKey,
);

router.patch(
  '/:key',
  checkAuth({ permissions: [{ module: 'settings', action: 'UPDATE' }] }),
  validateRequest(SystemSettingValidation.updateSystemSettingSchema),
  SystemSettingController.updateSetting,
);

router.delete(
  '/:key',
  checkAuth({ requireSuperAdmin: true }), // Only super admins can delete settings
  SystemSettingController.deleteSetting,
);

export const SystemSettingRoutes = router;
