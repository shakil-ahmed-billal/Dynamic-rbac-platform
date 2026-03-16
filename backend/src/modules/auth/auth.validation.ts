import z from 'zod';

export const registerZodSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const loginZodSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters'),
});

export const forgotPasswordZodSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordZodSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(6, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters'),
});
