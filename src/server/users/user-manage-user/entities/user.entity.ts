import { v4 } from 'uuid';
import { State, UserEntityCore } from 'share/entities/user.core.entity';
import { UserModel } from 'share/models/user.model';
import { TenantEntity } from './tenant.entity';

export { State } from 'share/entities/user.core.entity';

type FactoryProperties = {
  code: string;
  passwordHash: string;
  name: string;
  displayName: string;
  email: string | null;
};

export class UserEntity extends UserEntityCore {
  static factory(tenant: TenantEntity, properties: FactoryProperties): UserEntity {
    const uuid = v4();
    return new UserEntity({
      ...properties,
      uuid,
      tenantId: tenant.id,
      state: State.ACTIVE,
      createdAt: new Date(),
      tenant,
    });
  }

  static fromModel(model: UserModel): UserEntity {
    const tenant = super.fromModel(model);
    return new UserEntity(tenant.properties);
  }

  static fromEntity(entity: UserEntityCore): UserEntity {
    return new UserEntity(entity.properties);
  }
}
