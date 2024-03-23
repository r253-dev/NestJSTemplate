import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';
import { UserEntity } from './entities/user.entity';
import { UserAuthRepository } from './user-auth.repository';

@Injectable()
export class UserAuthUsecase {
  constructor(
    private repository: UserAuthRepository,
    private bcrypt: BcryptService,
    private jwtService: JwtService,
  ) {}

  async validateUser(tenantCode: string, code: string, password: string) {
    try {
      const user = await this.findByCode(tenantCode, code);

      if (user.isAbleToLogin() === false) {
        throw new Error();
      }

      await this.verifyPassword(user.passwordHash, password);
      return user;
    } catch (e) {
      throw new UnauthorizedException('ログインIDまたはパスワードが間違っています');
    }
  }

  private async findByCode(tenantCode: string, code: string): Promise<UserEntity> {
    const user = await this.repository.findByCode(tenantCode, code);
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUuid(uuid: string): Promise<UserEntity> {
    const user = await this.repository.findByUuid(uuid);
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
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

  async issueToken(user: UserEntity): Promise<string> {
    return await this.jwtService.signAsync({
      type: 'user',
      sub: user.uuid,
    });
  }
}
