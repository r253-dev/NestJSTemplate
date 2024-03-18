import { Injectable, UnauthorizedException } from '@nestjs/common';
import express from 'express';
import { AdminAuthUsecase } from './admin-auth.usecase';
import { AdminAuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AdminAuthService {
  constructor(private usecase: AdminAuthUsecase) {}

  async login(
    req: express.Request,
    email: string,
    password: string,
  ): Promise<AdminAuthResponseDto> {
    try {
      const administrator = await this.usecase.validateAdministrator(email, password);
      const token = await this.usecase.issueToken(administrator);
      this.usecase.setTokenCookie(req, token);

      return {
        token: token,
      };
    } catch (e) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが間違っています');
    }
  }
}
