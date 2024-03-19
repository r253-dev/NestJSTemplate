import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AdminAuthUsecase } from './admin-auth.usecase';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usecase: AdminAuthUsecase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const administrator = await this.usecase.findByUuid(payload.sub);
    return administrator;
  }
}
