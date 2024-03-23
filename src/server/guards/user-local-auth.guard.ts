import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userAuthSchema } from './dto/user-auth.dto';

@Injectable()
export class UserLocalAuthGuard extends AuthGuard('user-local') {
  canActivate(context: ExecutionContext) {
    const body = context.getArgByIndex(0).body;

    try {
      userAuthSchema.parse(body);
    } catch (e) {
      throw new BadRequestException({
        errors: (e as any).errors,
        message: 'Validation failed',
        statusCode: 400,
      });
    }

    return super.canActivate(context);
  }
}
