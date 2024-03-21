import { createZodDto } from 'nestjs-zod';
import { tenantSchema } from 'share/dto/tenant.dto';

const creationSchema = tenantSchema.pick({
  code: true,
});
export class AdminManageTenantCreationDto extends createZodDto(creationSchema) {}
