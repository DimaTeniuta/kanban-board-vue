import { z } from 'zod';

export const boardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Board = z.infer<typeof boardSchema>;
