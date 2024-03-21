import z from 'zod';

export const tenantSchema = z.object({
  id: z.bigint(),
  uuid: z.string().uuid(),
  code: z.string().max(32),
  state: z.enum(['inactive', 'active', 'disabled', 'removed']),
  createdAt: z.date(),
});
