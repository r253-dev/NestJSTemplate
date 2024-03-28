import z from 'zod';

export const userSchema = z.object({
  id: z.bigint(),
  uuid: z.string().uuid(),
  code: z.string().min(3).max(30),
  password: z.string().min(8, 'パスワードは8文字以上の長さが必要です'),
  passwordHash: z.string(),
  state: z.enum(['inactive', 'active', 'disabled', 'removed']),
  name: z.string().max(255),
  displayName: z.string().max(255),
  email: z.string().email().max(512).nullable(),
  createdAt: z.date(),
});
