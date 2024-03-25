import { createZodDto } from 'nestjs-zod';
import { prefectureSchema } from 'share/dto/prefecture.dto';

const creationSchema = prefectureSchema.pick({
  code: true,
  name: true,
  nameKana: true,
});
export class AdminManagePrefectureCreationDto extends createZodDto(creationSchema) {}
