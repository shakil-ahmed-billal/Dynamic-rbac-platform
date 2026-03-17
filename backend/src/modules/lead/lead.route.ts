import express from 'express';
import { LeadController } from './lead.controller';
import { LeadValidation } from './lead.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  checkAuth({ permissions: [{ module: 'leads', action: 'WRITE' }] }),
  validateRequest(LeadValidation.createLeadSchema),
  LeadController.createLead,
);

router.get(
  '/',
  checkAuth({ permissions: [{ module: 'leads', action: 'READ' }] }),
  LeadController.getAllLeads,
);

router.get(
  '/:id',
  checkAuth({ permissions: [{ module: 'leads', action: 'READ' }] }),
  LeadController.getLeadById,
);

router.patch(
  '/:id',
  checkAuth({ permissions: [{ module: 'leads', action: 'UPDATE' }] }),
  validateRequest(LeadValidation.updateLeadSchema),
  LeadController.updateLead,
);

router.delete(
  '/:id',
  checkAuth({ permissions: [{ module: 'leads', action: 'DELETE' }] }),
  LeadController.deleteLead,
);

export const LeadRoutes = router;
