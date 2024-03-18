import z from 'zod';

export const administratorSchema = z.object({
  id: z.bigint(),
  uuid: z.string().uuid(),
  email: z.string().email().max(512),
  password: z.string().min(8, 'パスワードは8文字以上の長さが必要です'),
  passwordHash: z.string(),
  createdAt: z.date(),
});
