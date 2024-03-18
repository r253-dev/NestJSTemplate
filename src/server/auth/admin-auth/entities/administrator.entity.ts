import { AdministratorEntityCore } from 'share/entities/administrator.core.entity';
import { AdministratorModel } from 'share/models/administrator.model';

export class AdministratorEntity extends AdministratorEntityCore {
  static fromModel(model: AdministratorModel): AdministratorEntity {
    return new AdministratorEntity({
      id: model.id,
      uuid: model.uuid,
      email: model.email,
      passwordHash: model.passwordHash,
      createdAt: model.createdAt,
    });
  }

  isAbleToLogin(): boolean {
    if (this.properties.passwordHash === null) {
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
