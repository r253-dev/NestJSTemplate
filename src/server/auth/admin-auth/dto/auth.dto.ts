import { createZodDto } from 'nestjs-zod';
import { administratorSchema } from 'share/dto/administrator.dto';
import { z } from 'zod';

const authSchema = administratorSchema.pick({
  email: true,
  password: true,
});
export class AdminAuthDto extends createZodDto(authSchema) {}

const responseSchema = z.object({
  token: z.string(),
});
export class AdminAuthResponseDto extends createZodDto(responseSchema) {}
