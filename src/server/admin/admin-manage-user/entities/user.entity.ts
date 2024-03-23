import { v4 } from 'uuid';
import { UserModel } from 'share/models/user.model';
import { UserEntityCore, State, UserEntityProperties } from 'share/entities/user.core.entity';
import { TenantEntity } from './tenant.entity';

interface Properties extends UserEntityProperties {
  tenant?: TenantEntity;
}

export class UserEntity extends UserEntityCore<Properties> {
  static factory(
    tenant: TenantEntity,
    code: string,
    passwordHash: string,
    email: string | null,
  ): UserEntity {
    const uuid = v4();
    return new UserEntity({
      tenantId: tenant.id,
      uuid,
      code: code,
      passwordHash,
      state: State.ACTIVE,
      email,
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
