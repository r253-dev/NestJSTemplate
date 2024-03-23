import { createZodDto } from 'nestjs-zod';
import { userSchema } from 'share/dto/user.dto';
import { tenantSchema } from 'share/dto/tenant.dto';

export const userAuthSchema = userSchema
  .pick({
    code: true,
    password: true,
  })
  .extend({
    tenantCode: tenantSchema.shape.code,
  });
export class UserAuthDto extends createZodDto(userAuthSchema) {}
