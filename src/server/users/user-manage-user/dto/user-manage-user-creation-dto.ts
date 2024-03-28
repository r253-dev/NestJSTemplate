import { createZodDto } from 'nestjs-zod';
import { userSchema } from 'share/dto/user.dto';

const creationSchema = userSchema.pick({
  code: true,
  password: true,
  name: true,
  displayName: true,
  email: true,
});
export class UserManageUserCreationDto extends createZodDto(creationSchema) {}
