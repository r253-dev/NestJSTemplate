import { Injectable } from '@nestjs/common';
import { UserEntityCore } from 'share/entities/user.core.entity';

@Injectable()
export class UserProfileService {
  getProfile(user: UserEntityCore) {
    return {
      uuid: user.uuid,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
