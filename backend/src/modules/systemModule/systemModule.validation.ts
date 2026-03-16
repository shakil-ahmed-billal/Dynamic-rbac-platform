import z from 'zod';

export const createSystemModuleZodSchema = z.object({
  name: z
    .string()
    .min(2, 'Module name must be at least 2 characters')
    .max(50, 'Module name must be at most 50 characters')
    .toLowerCase(),
  description: z.string().optional(),
});

export const updateSystemModuleZodSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
