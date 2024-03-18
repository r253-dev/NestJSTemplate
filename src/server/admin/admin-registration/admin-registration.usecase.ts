import { ForbiddenException, Injectable } from '@nestjs/common';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdminRegistrationRepository } from './admin-registration.repository';

@Injectable()
export class AdminRegistrationUsecase {
  constructor(private repository: AdminRegistrationRepository) {}

  async register(createAdministratorDto: { email: string }): Promise<void> {
    if (!this.allowedEmail(createAdministratorDto.email)) {
      throw new ForbiddenException('許可されていないメールアドレスです');
    }

    const administrator = await this.findByEmail(createAdministratorDto.email);

    // 既に存在しているならエラーすら出さずに終わる
    if (administrator !== null) {
      return;
    }

    const newAdministrator = AdministratorEntity.factory(createAdministratorDto.email);
    await this.repository.save(newAdministrator);
    // TODO: ここでメール送信
  }

  private allowedEmail(email: string): boolean {
    if (email === 'r253.hmdryou@gmail.com') {
      return true;
    }

    if (email.match(/@example.com$/)) {
      return true;
    }

    return false;
  }

  private async findByEmail(email: string): Promise<AdministratorEntity | null> {
    const model = await this.repository.findByEmail(email);
    if (model === null) {
      return null;
    }
    return AdministratorEntity.fromModel(model);
  }
}
