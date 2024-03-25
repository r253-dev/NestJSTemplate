import { createZodDto } from 'nestjs-zod';
import { prefectureSchema } from 'share/dto/prefecture.dto';

const responseSchema = prefectureSchema.pick({
  uuid: true,
  code: true,
  name: true,
  nameKana: true,
});
export class AdminManagePrefectureResponseDto extends createZodDto(responseSchema) {}
