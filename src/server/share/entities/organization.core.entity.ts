import { Entity, PropertiesCore } from 'share/entity';
import { OrganizationModel, State as ModelState } from 'share/models/organization.model';
import { TenantEntityCore } from './tenant.core.entity';
import { TenantModel } from 'share/models/tenant.model';

export const enum State {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  REMOVED = 'removed',
  ARCHIVED = 'archived',
}

interface PropertiesEssential {
  name: string;
  nameKana: string;
}

export interface OrganizationEntityProperties extends PropertiesCore, PropertiesEssential {
  tenantId: bigint;
  uuid: string;
  code: string | null;
  state: State;
  createdAt: Date;

  tenant?: TenantEntityCore;
}

export class OrganizationEntityCore<
  T extends OrganizationEntityProperties = OrganizationEntityProperties,
> extends Entity<T> {
  toModel(): OrganizationModel {
    const model = new OrganizationModel({
      id: this.properties.id,
      tenantId: this.properties.tenantId,
      uuid: this.properties.uuid,
      code: this.properties.code,
      name: this.properties.name,
      nameKana: this.properties.nameKana,
      state: OrganizationEntityCore.toModel$state(this.properties.state),
      createdAt: this.properties.createdAt,
    });
    model.isNewRecord = this.properties.id === undefined;
    return model;
  }

  static toModel$state(state: State): ModelState {
    switch (state) {
      case State.ACTIVE:
        return ModelState.ACTIVE;
      case State.DISABLED:
        return ModelState.DISABLED;
      case State.REMOVED:
        return ModelState.REMOVED;
      case State.ARCHIVED:
        return ModelState.ARCHIVED;
    }
  }

  static fromModel(model: OrganizationModel): OrganizationEntityCore<OrganizationEntityProperties> {
    const fromModel$tenant = (tenant?: TenantModel): TenantEntityCore | undefined => {
      if (tenant === undefined) {
        return undefined;
      }
      return TenantEntityCore.fromModel(tenant);
    };
    return new OrganizationEntityCore({
      id: model.id,
      tenantId: model.tenantId,
      uuid: model.uuid,
      code: model.code,
      name: model.name,
      nameKana: model.nameKana,
      state: this.fromModel$State(model.state),
      createdAt: model.createdAt,

      tenant: fromModel$tenant(model.tenant),
    });
  }

  static fromModel$State(state: ModelState): State {
    switch (state) {
      case ModelState.ACTIVE:
        return State.ACTIVE;
      case ModelState.DISABLED:
        return State.DISABLED;
      case ModelState.REMOVED:
        return State.REMOVED;
      case ModelState.ARCHIVED:
        return State.ARCHIVED;
    }
  }

  get uuid(): string {
    return this.properties.uuid;
  }

  get code(): string | null {
    return this.properties.code;
  }

  get name(): string {
    return this.properties.name;
  }

  get nameKana(): string {
    return this.properties.nameKana;
  }

  get state(): State {
    return this.properties.state;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get tenant(): TenantEntityCore | undefined {
    return this.properties.tenant;
  }
}
