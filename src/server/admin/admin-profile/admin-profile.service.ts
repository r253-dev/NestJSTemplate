import { Injectable } from '@nestjs/common';
import { AdministratorEntityCore } from 'share/entities/administrator.core.entity';

@Injectable()
export class AdminProfileService {
  async test() {
    return `success`;
  }

  getProfile(user: AdministratorEntityCore) {
    return {
      uuid: user.uuid,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
