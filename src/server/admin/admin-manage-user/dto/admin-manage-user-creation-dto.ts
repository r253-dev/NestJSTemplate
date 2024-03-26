import { createZodDto } from 'nestjs-zod';
import { userSchema } from 'share/dto/user.dto';

const creationSchema = userSchema
  .pick({
    code: true,
    password: true,
    name: true,
    displayName: true,
  })
  .extend({
    email: userSchema.shape.email.optional(),
  });
export class AdminManageUserCreationDto extends createZodDto(creationSchema) {}
