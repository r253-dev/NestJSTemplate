import z from 'zod';

export const prefectureSchema = z.object({
  id: z.bigint(),
  uuid: z.string().uuid(),
  code: z.string().max(10),
  name: z.string().max(255),
  nameKana: z.string().max(255),
  createdAt: z.date(),
});
