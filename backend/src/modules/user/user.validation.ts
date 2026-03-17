import z from 'zod';

export const createUserZodSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

export const updateUserZodSchema = z.object({
  name: z.string().min(2).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  profilePhoto: z.string().url().optional(),
  status: z.enum(['ACTIVE', 'BLOCKED']).optional(),
  roleId: z.string().optional(),
});

export const updateUserStatusZodSchema = z.object({
  status: z.enum(['ACTIVE', 'BLOCKED']),
});

export const assignRolesZodSchema = z.object({
  roleIds: z
    .array(z.string())
    .min(1, 'At least one role ID is required'),
});
