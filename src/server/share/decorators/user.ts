import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntityCore } from 'share/entities/user.core.entity';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntityCore => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
