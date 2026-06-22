import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' })
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
