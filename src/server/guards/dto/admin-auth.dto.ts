import { createZodDto } from 'nestjs-zod';
import { administratorSchema } from 'share/dto/administrator.dto';

export const adminAuthSchema = administratorSchema.pick({
  email: true,
  password: true,
});
export class AdminAuthDto extends createZodDto(adminAuthSchema) {}
