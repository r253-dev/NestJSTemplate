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
}
