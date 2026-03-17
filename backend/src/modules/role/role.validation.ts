import z from 'zod';

export const createRoleZodSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be at most 50 characters'),
  description: z.string().optional(),
});

export const updateRoleZodSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const assignPermissionsZodSchema = z.object({
  permissionIds: z.array(z.string()),
});
