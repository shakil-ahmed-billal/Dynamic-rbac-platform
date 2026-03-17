import { z } from 'zod';

const createSystemSettingSchema = z.object({
  key: z.string({ message: 'Key is required' }),
  value: z.string({ message: 'Value is required' }),
  description: z.string().optional(),
});

const updateSystemSettingSchema = z.object({
  value: z.string().optional(),
  description: z.string().optional(),
});

export const SystemSettingValidation = {
  createSystemSettingSchema,
  updateSystemSettingSchema,
};
