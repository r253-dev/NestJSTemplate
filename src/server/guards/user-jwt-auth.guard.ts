import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('user-jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path = request.path;
    if (!path.startsWith('/v1/users/~')) {
      return true;
    }
    return super.canActivate(context);
  }
}
