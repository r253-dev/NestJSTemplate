import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { administratorSchema } from 'share/dto/administrator.dto';

export const adminAuthSchema = administratorSchema.pick({
  email: true,
  password: true,
});
export class AdminAuthDto extends createZodDto(adminAuthSchema) {}

const responseSchema = z.object({
  token: z.string(),
});
export class AdminAuthResponseDto extends createZodDto(responseSchema) {}
