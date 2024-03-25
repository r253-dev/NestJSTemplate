import z from 'zod';

export const organizationSchema = z.object({
  id: z.bigint(),
  uuid: z.string().uuid(),
  code: z.string().max(10).nullable(),
  name: z.string().max(255),
  nameKana: z.string().max(255),
  state: z.enum(['active', 'disabled', 'removed', 'archived']),
  createdAt: z.date(),
});
