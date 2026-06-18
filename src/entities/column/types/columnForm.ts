import { z } from 'zod';

export const columnFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must be at most 100 characters')
});

export type ColumnFormValues = z.infer<typeof columnFormSchema>;
