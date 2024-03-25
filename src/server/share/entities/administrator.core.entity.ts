import { AdministratorModel, State as ModelState } from 'share/models/administrator.model';
import { Entity, PropertiesCore } from 'share/entity';
import { Role } from 'share/enums/role.enum';

export const enum State {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  REMOVED = 'removed',
}

interface PropertiesEssential {
  email: string;
}

interface Properties extends PropertiesCore, PropertiesEssential {
  uuid: string;
  passwordHash: string | null;
  state: State;
  createdAt: Date;
}

export class AdministratorEntityCore extends Entity<Properties> {
  toModel(): AdministratorModel {
    const model = new AdministratorModel({
      id: this.properties.id,
      uuid: this.properties.uuid,
      email: this.properties.email,
      passwordHash: this.properties.passwordHash,
      state: AdministratorEntityCore.toModel$state(this.properties.state),
      createdAt: this.properties.createdAt,
    });
    model.isNewRecord = this.properties.id === undefined;
    return model;
  }

  static toModel$state(state: State): ModelState {
    switch (state) {
      case State.INACTIVE:
        return ModelState.INACTIVE;
      case State.ACTIVE:
        return ModelState.ACTIVE;
      case State.DISABLED:
        return ModelState.DISABLED;
      case State.REMOVED:
        return ModelState.REMOVED;
    }
  }

  static fromModel(model: AdministratorModel): AdministratorEntityCore {
    return new AdministratorEntityCore({
      id: model.id,
      uuid: model.uuid,
      email: model.email,
      passwordHash: model.passwordHash,
      state: this.fromModel$State(model.state),
      createdAt: model.createdAt,
    });
  }

  static fromModel$State(state: ModelState): State {
    switch (state) {
      case ModelState.INACTIVE:
        return State.INACTIVE;
      case ModelState.ACTIVE:
        return State.ACTIVE;
      case ModelState.DISABLED:
        return State.DISABLED;
      case ModelState.REMOVED:
        return State.REMOVED;
    }
  }

  get uuid(): string {
    return this.properties.uuid;
  }

  get email(): string {
    return this.properties.email;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get roles(): Role[] {
    // FIXME: DBから取得する
    return [Role.ADMIN];
  }
}
