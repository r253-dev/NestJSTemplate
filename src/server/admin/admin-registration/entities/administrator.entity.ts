import { v4 } from 'uuid';
import { AdministratorEntityCore, State } from 'share/entities/administrator.core.entity';
import { AdministratorModel } from 'share/models/administrator.model';

export class AdministratorEntity extends AdministratorEntityCore {
  static factory(email: string): AdministratorEntityCore {
    const uuid = v4();
    return new AdministratorEntity({
      email,
      uuid,
      passwordHash: null,
      state: State.INACTIVE,
      createdAt: new Date(),
    });
  }

  static fromModel(model: AdministratorModel): AdministratorEntity {
    return new AdministratorEntity({
      id: model.id,
      uuid: model.uuid,
      email: model.email,
      passwordHash: model.passwordHash,
      state: this.fromModel$State(model.state),
      createdAt: model.createdAt,
    });
  }
}
