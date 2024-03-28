import { Entity, PropertiesCore } from 'share/entity';
import { UserModel, State as ModelState } from 'share/models/user.model';
import { TenantEntityCore } from './tenant.core.entity';
import { TenantModel } from 'share/models/tenant.model';

export const enum State {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  REMOVED = 'removed',
}

interface PropertiesEssential {
  code: string;
  email: string | null;
}

export interface UserEntityProperties extends PropertiesCore, PropertiesEssential {
  tenantId: bigint;
  uuid: string;
  passwordHash: string | null;
  state: State;
  name: string;
  displayName: string;
  email: string | null;
  createdAt: Date;

  tenant?: TenantEntityCore;
}

export class UserEntityCore<
  T extends UserEntityProperties = UserEntityProperties,
> extends Entity<T> {
  toModel(): UserModel {
    const model = new UserModel({
      id: this.properties.id,
      tenantId: this.properties.tenantId,
      uuid: this.properties.uuid,
      code: this.properties.code,
      passwordHash: this.properties.passwordHash,
      state: UserEntityCore.toModel$state(this.properties.state),
      name: this.properties.name,
      displayName: this.properties.displayName,
      email: this.properties.email,
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

  static fromModel(model: UserModel): UserEntityCore<UserEntityProperties> {
    const fromModel$tenant = (tenant?: TenantModel): TenantEntityCore | undefined => {
      if (tenant === undefined) {
        return undefined;
      }
      return TenantEntityCore.fromModel(tenant);
    };
    return new UserEntityCore({
      id: model.id,
      tenantId: model.tenantId,
      uuid: model.uuid,
      code: model.code,
      passwordHash: model.passwordHash,
      state: this.fromModel$State(model.state),
      name: model.name,
      displayName: model.displayName,
      email: model.email,
      createdAt: model.createdAt,

      tenant: fromModel$tenant(model.tenant),
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

  get state(): State {
    return this.properties.state;
  }

  get name(): string {
    return this.properties.name;
  }

  get displayName(): string {
    return this.properties.displayName;
  }

  get email(): string | null {
    return this.properties.email;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get tenant(): TenantEntityCore {
    if (this.properties.tenant === undefined) {
      throw new Error('tenant is not set');
    }
    return this.properties.tenant;
  }
}
