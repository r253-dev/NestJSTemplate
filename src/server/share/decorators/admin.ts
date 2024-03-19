import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdministratorEntityCore } from 'share/entities/administrator.core.entity';

export const Admin = createParamDecorator(
  (data: unknown, context: ExecutionContext): AdministratorEntityCore => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
