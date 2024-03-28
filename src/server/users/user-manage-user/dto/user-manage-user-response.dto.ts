import { createZodDto } from 'nestjs-zod';
import { userSchema } from 'share/dto/user.dto';

const responseSchema = userSchema.pick({
  uuid: true,
  state: true,
  name: true,
  displayName: true,
  email: true,
});
export class UserManageUserResponseDto extends createZodDto(responseSchema) {}
