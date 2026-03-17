import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string({ message: 'Title is required' }),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  dueDate: z.preprocess((val) => (val === '' ? null : val ? new Date(val as string) : val), z.date().optional().nullable()),
  assignedTo: z.preprocess((val) => (val === '' ? null : val), z.string().cuid().optional().nullable()),
});

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  dueDate: z.preprocess((val) => (val === '' ? null : val ? new Date(val as string) : val), z.date().optional().nullable()),
  assignedTo: z.preprocess((val) => (val === '' ? null : val), z.string().cuid().optional().nullable()),
});

export const TaskValidation = {
  createTaskSchema,
  updateTaskSchema,
};
