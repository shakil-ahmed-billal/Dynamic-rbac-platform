import express from 'express';
import { TaskController } from './task.controller';
import { TaskValidation } from './task.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  checkAuth({ permissions: [{ module: 'tasks', action: 'WRITE' }] }),
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask,
);

router.get(
  '/',
  checkAuth({ permissions: [{ module: 'tasks', action: 'READ' }] }),
  TaskController.getAllTasks,
);

router.get(
  '/:id',
  checkAuth({ permissions: [{ module: 'tasks', action: 'READ' }] }),
  TaskController.getTaskById,
);

router.patch(
  '/:id',
  checkAuth({ permissions: [{ module: 'tasks', action: 'UPDATE' }] }),
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask,
);

router.delete(
  '/:id',
  checkAuth({ permissions: [{ module: 'tasks', action: 'DELETE' }] }),
  TaskController.deleteTask,
);

export const TaskRoutes = router;
