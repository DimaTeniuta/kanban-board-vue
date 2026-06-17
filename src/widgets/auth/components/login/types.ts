import { z } from 'zod';

import type { User } from 'shared/types/user';

export const loginSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' })
});

export type LoginSchema = z.infer<typeof loginSchema>;

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}
