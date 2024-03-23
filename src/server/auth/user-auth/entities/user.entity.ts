import { UserEntityCore, State, UserEntityProperties } from 'share/entities/user.core.entity';
import { UserModel } from 'share/models/user.model';

export class UserEntity extends UserEntityCore<UserEntityProperties> {
  static fromModel(model: UserModel): UserEntity {
    const base = super.fromModel(model);
    return new UserEntity(base.properties);
  }

  isAbleToLogin(): boolean {
    if (this.properties.passwordHash === null) {
      return false;
    }
    if ([State.INACTIVE, State.DISABLED, State.REMOVED].includes(this.properties.state)) {
      return false;
    }
    return true;
  }

  get passwordHash(): string {
    if (this.properties.passwordHash === null) {
      throw new Error('無効なユーザーです');
    }
    return this.properties.passwordHash;
  }
}
