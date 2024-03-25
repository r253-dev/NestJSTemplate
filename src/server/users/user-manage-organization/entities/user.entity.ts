import { UserEntityCore } from 'share/entities/user.core.entity';
import { UserModel } from 'share/models/user.model';

export class UserEntity extends UserEntityCore {
  static fromModel(model: UserModel): UserEntity {
    const tenant = super.fromModel(model);
    return new UserEntity(tenant.properties);
  }

  static fromEntity(entity: UserEntityCore): UserEntity {
    return new UserEntity(entity.properties);
  }
}
