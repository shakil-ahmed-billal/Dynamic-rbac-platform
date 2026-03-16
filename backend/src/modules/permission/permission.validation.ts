import z from 'zod';

export const createPermissionZodSchema = z.object({
  action: z.enum(['READ', 'WRITE', 'UPDATE', 'DELETE', 'MANAGE']),
  moduleId: z.string().min(1, 'Module ID is required'),
});

export const updatePermissionZodSchema = z.object({
  action: z.enum(['READ', 'WRITE', 'UPDATE', 'DELETE', 'MANAGE']).optional(),
  moduleId: z.string().optional(),
});
