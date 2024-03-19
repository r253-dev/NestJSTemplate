import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminAuthUsecase } from './admin-auth.usecase';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private usecase: AdminAuthUsecase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const path = request.path;
      if (!path.startsWith('/v1/admin/~')) {
        return true;
      }
      const result = await this.usecase.getAuthorizedToken(request);

      request['user'] = {
        type: 'administrator',
        administrator: {
          sub: result.payload.sub,
        },
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
