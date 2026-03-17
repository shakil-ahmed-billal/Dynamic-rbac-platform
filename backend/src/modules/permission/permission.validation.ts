import z from 'zod';

export const createPermissionZodSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  moduleId: z.string().min(1, 'Module ID is required'),
});

export const updatePermissionZodSchema = z.object({
  action: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  moduleId: z.string().optional(),
});
