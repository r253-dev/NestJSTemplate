import { createZodDto } from 'nestjs-zod';
import { organizationSchema } from 'share/dto/organization.dto';

const responseSchema = organizationSchema.pick({
  uuid: true,
  code: true,
  name: true,
  nameKana: true,
  state: true,
});
export class UserManageOrganizationResponseDto extends createZodDto(responseSchema) {}
