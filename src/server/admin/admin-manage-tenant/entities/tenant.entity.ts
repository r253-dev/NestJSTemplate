import { v4 } from 'uuid';
import { TenantEntityCore, State } from 'share/entities/tenant.core.entity';
import { TenantModel } from 'share/models/tenant.model';

export class TenantEntity extends TenantEntityCore {
  static factory(code: string): TenantEntity {
    const uuid = v4();
    return new TenantEntity({
      uuid,
      code,
      state: State.ACTIVE,
      createdAt: new Date(),
    });
  }

  static fromModel(model: TenantModel): TenantEntity {
    const tenant = super.fromModel(model);
    return new TenantEntity(tenant.properties);
  }

  remove(): void {
    this.properties.state = State.REMOVED;
  }
}
