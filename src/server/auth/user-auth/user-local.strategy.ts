import express from 'express';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { UserAuthUsecase } from './user-auth.usecase';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, 'user-local') {
  constructor(private usecase: UserAuthUsecase) {
    super({ usernameField: 'code', passReqToCallback: true });
  }

  async validate(@Request() req: express.Request, code: string, password: string): Promise<any> {
    const tenantCode = req.body.tenantCode;

    const user = await this.usecase.validateUser(tenantCode, code, password);
    if (!user) {
      throw new UnauthorizedException('認証に失敗しました。');
    }
    return user;
  }
}
