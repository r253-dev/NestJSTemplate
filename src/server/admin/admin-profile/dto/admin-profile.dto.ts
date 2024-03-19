import { createZodDto } from 'nestjs-zod';
import { administratorSchema } from 'share/dto/administrator.dto';

const responseSchema = administratorSchema.pick({
  uuid: true,
  email: true,
  createdAt: true,
});
export class AdminProfileResponseDto extends createZodDto(responseSchema) {}
