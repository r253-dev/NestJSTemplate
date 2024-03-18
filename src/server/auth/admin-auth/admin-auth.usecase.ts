import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import express from 'express';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdminAuthRepository } from './admin-auth.repository';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthUsecase {
  constructor(
    private repository: AdminAuthRepository,
    private bcrypt: BcryptService,
    private jwtService: JwtService,
  ) {}

  async validateAdministrator(email: string, password: string) {
    const administrator = await this.findByEmail(email);

    if (administrator.isAbleToLogin() === false) {
      throw new UnauthorizedException();
    }

    await this.verifyPassword(administrator.passwordHash, password);
    return administrator;
  }

  private async findByEmail(email: string): Promise<AdministratorEntity> {
    const administrator = await this.repository.findByEmail(email);
    if (administrator === null) {
      throw new NotFoundException('Administrator not found');
    }
    return administrator;
  }

  /**
   * @throws UnauthorizedException if wrong password
   */
  private async verifyPassword(hash: string, password: string): Promise<void> {
    const result = await this.bcrypt.compare(password, hash);
    if (!result) {
      throw new UnauthorizedException('Wrong password');
    }
  }

  async issueToken(administrator: AdministratorEntity): Promise<string> {
    return await this.jwtService.signAsync({
      type: 'administrator',
      sub: administrator.uuid,
    });
  }

  setTokenCookie(req: express.Request, token: string): void {
    req.res!.cookie('adminToken', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  async getAuthorizedToken(req: express.Request) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.verifyToken(token);
    return {
      token,
      payload,
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
      });

      if (payload.type !== 'administrator') {
        throw new UnauthorizedException(); // 管理者以外のトークン
      }

      return payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: express.Request): string | undefined {
    // Bearerトークンがある場合、そちらを優先する
    const authorization = request.headers.authorization;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type === 'Bearer') {
        return token;
      }
    }

    // cookieのトークンを取得
    const cookie = request.headers.cookie;
    if (!cookie) {
      return undefined;
    }

    const cookies = cookie.split(';');
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('adminToken='));
    if (!tokenCookie) {
      return undefined;
    }

    const token = tokenCookie.split('=')[1];
    return token;
  }
}
