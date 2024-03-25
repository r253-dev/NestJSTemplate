import { Injectable } from '@nestjs/common';
import { UserEntityCore } from 'share/entities/user.core.entity';

@Injectable()
export class UserProfileService {
  getProfile(admin: UserEntityCore) {
    return {
      uuid: admin.uuid,
      email: admin.email,
      createdAt: admin.createdAt,
    };
  }
}
