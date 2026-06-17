import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string({ message: 'Name is required' }).min(1, { message: 'Name is required' }),
    email: z.string({ message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    passwordRepeat: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' })
  })
  .superRefine(({ password, passwordRepeat }, ctx) => {
    if (password !== passwordRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['passwordRepeat']
      });
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export interface RegisterResult {
  message: string;
}
