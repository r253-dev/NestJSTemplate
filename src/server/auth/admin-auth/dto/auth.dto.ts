import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const responseSchema = z.object({
  token: z.string(),
});
export class AdminAuthResponseDto extends createZodDto(responseSchema) {}
