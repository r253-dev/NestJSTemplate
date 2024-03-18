import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { administratorSchema } from 'share/dto/administrator.dto';

const registrationSchema = administratorSchema.pick({
  email: true,
});
export class AdministratorRegistrationDto extends createZodDto(registrationSchema) {}

const responseSchema = z.object({
  status: z.enum(['success', 'failed']),
});
export class AdministratorRegistrationResponseDto extends createZodDto(responseSchema) {}
