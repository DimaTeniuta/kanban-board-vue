import { z } from 'zod';

export const boardFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().trim().max(300, 'Description must be at most 300 characters').optional().or(z.literal(''))
});

export type BoardFormValues = z.infer<typeof boardFormSchema>;
