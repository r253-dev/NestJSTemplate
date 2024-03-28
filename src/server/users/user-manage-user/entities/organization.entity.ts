import { v4 } from 'uuid';
import { OrganizationModel } from 'share/models/organization.model';
import { TenantEntity } from './tenant.entity';
import {
  OrganizationEntityCore,
  OrganizationEntityProperties,
  State,
} from 'share/entities/organization.core.entity';

interface Properties extends OrganizationEntityProperties {
  tenant?: TenantEntity;
}

export class OrganizationEntity extends OrganizationEntityCore<Properties> {
  static factory(
    tenant: TenantEntity,
    code: string | null,
    name: string,
    nameKana: string,
  ): OrganizationEntity {
    const uuid = v4();
    return new OrganizationEntity({
      tenantId: tenant.id,
      uuid,
      code,
      name,
      nameKana,
      state: State.ACTIVE,
      createdAt: new Date(),

      tenant,
    });
  }

  static fromModel(model: OrganizationModel): OrganizationEntity {
    const baseEntity = super.fromModel(model);
    const tenant = baseEntity.properties.tenant
      ? new TenantEntity(baseEntity.properties.tenant.properties)
      : undefined;

    return new OrganizationEntity({
      ...baseEntity.properties,
      tenant: tenant,
    });
  }

  remove(): void {
    this.properties.state = State.REMOVED;
  }

  archive(): void {
    this.properties.state = State.ARCHIVED;
  }
}
