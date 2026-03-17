import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  email: z.string({ message: 'Email is required' }).email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON']).optional(),
  source: z.string().optional(),
  assignedTo: z.preprocess((val) => (val === '' ? null : val), z.string().cuid().optional().nullable()),
});

const updateLeadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON']).optional(),
  source: z.string().optional(),
  assignedTo: z.preprocess((val) => (val === '' ? null : val), z.string().cuid().optional().nullable()),
});

export const LeadValidation = {
  createLeadSchema,
  updateLeadSchema,
};
