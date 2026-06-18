import { z } from 'zod';

import { taskPrioritySchema } from './task';

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().trim().max(300, 'Description must be at most 300 characters').optional().or(z.literal('')),
  priority: taskPrioritySchema
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
