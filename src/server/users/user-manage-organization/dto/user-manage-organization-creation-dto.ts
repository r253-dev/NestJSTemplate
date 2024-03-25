import { createZodDto } from 'nestjs-zod';
import { organizationSchema } from 'share/dto/organization.dto';

const creationSchema = organizationSchema.pick({
  code: true,
  name: true,
  nameKana: true,
});
export class UserManageOrganizationCreationDto extends createZodDto(creationSchema) {}
