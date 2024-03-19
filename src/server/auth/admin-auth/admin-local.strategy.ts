import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminAuthUsecase } from './admin-auth.usecase';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usecase: AdminAuthUsecase) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.usecase.validateAdministrator(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
