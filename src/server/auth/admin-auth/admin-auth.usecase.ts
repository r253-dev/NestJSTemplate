import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdminAuthRepository } from './admin-auth.repository';

@Injectable()
export class AdminAuthUsecase {
  constructor(
    private repository: AdminAuthRepository,
    private bcrypt: BcryptService,
    private jwtService: JwtService,
  ) {}

  async validateAdministrator(email: string, password: string) {
    try {
      const administrator = await this.findByEmail(email);

      if (administrator.isAbleToLogin() === false) {
        throw new Error();
      }

      await this.verifyPassword(administrator.passwordHash, password);
      return administrator;
    } catch (e) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが間違っています');
    }
  }

  private async findByEmail(email: string): Promise<AdministratorEntity> {
    const administrator = await this.repository.findByEmail(email);
    if (administrator === null) {
      throw new NotFoundException('Administrator not found');
    }
    return administrator;
  }

  async findByUuid(uuid: string): Promise<AdministratorEntity> {
    const administrator = await this.repository.findByUuid(uuid);
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
}
