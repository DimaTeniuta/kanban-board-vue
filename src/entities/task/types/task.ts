import { z } from 'zod';

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'NONE'] as const;

export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  order: z.number(),
  priority: taskPrioritySchema,
  columnId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Task = z.infer<typeof taskSchema>;
