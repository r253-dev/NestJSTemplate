import { TenantEntityCore } from 'share/entities/tenant.core.entity';
import { TenantModel } from 'share/models/tenant.model';

export class TenantEntity extends TenantEntityCore {
  static fromModel(model: TenantModel): TenantEntity {
    const tenant = super.fromModel(model);
    return new TenantEntity(tenant.properties);
  }

  static fromEntity(entity: TenantEntityCore): TenantEntity {
    return new TenantEntity(entity.properties);
  }
}
