import { createZodDto } from 'nestjs-zod';
import { administratorSchema } from 'share/dto/administrator.dto';

const creationSchema = administratorSchema.pick({
  email: true,
  password: true,
});
export class AdminManageCreationDto extends createZodDto(creationSchema) {}
