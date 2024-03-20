import { Injectable } from '@nestjs/common';
import { AdministratorEntityCore } from 'share/entities/administrator.core.entity';

@Injectable()
export class AdminProfileService {
  getProfile(admin: AdministratorEntityCore) {
    return {
      uuid: admin.uuid,
      email: admin.email,
      createdAt: admin.createdAt,
    };
  }
}
