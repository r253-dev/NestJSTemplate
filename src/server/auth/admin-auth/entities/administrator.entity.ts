import { AdministratorEntityCore, State } from 'share/entities/administrator.core.entity';
import { AdministratorModel } from 'share/models/administrator.model';

export class AdministratorEntity extends AdministratorEntityCore {
  static fromModel(model: AdministratorModel): AdministratorEntity {
    const base = super.fromModel(model);
    return new AdministratorEntity(base.properties);
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
      throw new Error('無効な管理者です');
    }
    return this.properties.passwordHash;
  }
}
