import z from 'zod';

export const userSchema = z.object({
  id: z.bigint(),
  uuid: z.string().uuid(),
  code: z.string().max(30),
  password: z.string().min(8, 'パスワードは8文字以上の長さが必要です'),
  passwordHash: z.string(),
  state: z.enum(['inactive', 'active', 'disabled', 'removed']),
  email: z.string().email().max(512).nullable(),
  createdAt: z.date(),
});
