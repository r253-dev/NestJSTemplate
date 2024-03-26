import { createZodDto } from 'nestjs-zod';
import { userSchema } from 'share/dto/user.dto';

const responseSchema = userSchema.pick({
  uuid: true,
  name: true,
  displayName: true,
  email: true,
  createdAt: true,
});
export class UserProfileResponseDto extends createZodDto(responseSchema) {}
