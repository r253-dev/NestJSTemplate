import { createZodDto } from 'nestjs-zod';
import { tenantSchema } from 'share/dto/tenant.dto';

const responseSchema = tenantSchema.pick({
  uuid: true,
  code: true,
});
export class AdminManageTenantResponseDto extends createZodDto(responseSchema) {}
