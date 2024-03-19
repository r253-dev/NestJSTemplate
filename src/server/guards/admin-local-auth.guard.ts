import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { adminAuthSchema } from './dto/admin-auth.dto';

@Injectable()
export class AdminLocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const body = context.getArgByIndex(0).body;

    try {
      adminAuthSchema.parse(body);
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
