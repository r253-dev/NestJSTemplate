import { v4 } from 'uuid';
import { UserModel } from 'share/models/user.model';
import { UserEntityCore, State, UserEntityProperties } from 'share/entities/user.core.entity';
import { TenantEntity } from './tenant.entity';

interface Properties extends UserEntityProperties {
  tenant?: TenantEntity;
}

type FactoryProps = {
  code: string;
  passwordHash: string;
  name: string;
  displayName: string;
  email: string | null;
};

export class UserEntity extends UserEntityCore<Properties> {
  static factory(tenant: TenantEntity, props: FactoryProps): UserEntity {
    const uuid = v4();
    return new UserEntity({
      ...props,
      tenantId: tenant.id,
      uuid,
      state: State.ACTIVE,
      createdAt: new Date(),
    });
  }

  static fromModel(model: UserModel): UserEntity {
    const baseEntity = super.fromModel(model);
    const tenant = baseEntity.properties.tenant
      ? new TenantEntity(baseEntity.properties.tenant.properties)
      : undefined;

    return new UserEntity({
      ...baseEntity.properties,
      tenant: tenant,
    });
  }

  remove(): void {
    this.properties.state = State.REMOVED;
  }
}
