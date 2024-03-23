import { Entity, PropertiesCore } from 'share/entity';
import { TenantModel, State as ModelState } from 'share/models/tenant.model';

export const enum State {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  REMOVED = 'removed',
}

interface PropertiesEssential {
  code: string;
}

interface Properties extends PropertiesCore, PropertiesEssential {
  uuid: string;
  state: State;
  createdAt: Date;
}

export class TenantEntityCore extends Entity<Properties> {
  toModel(): TenantModel {
    const model = new TenantModel({
      id: this.properties.id,
      uuid: this.properties.uuid,
      code: this.properties.code,
      state: TenantEntityCore.toModel$state(this.properties.state),
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

  static fromModel(model: TenantModel): TenantEntityCore {
    return new TenantEntityCore({
      id: model.id,
      uuid: model.uuid,
      code: model.code,
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

  get code(): string {
    return this.properties.code;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }
}
