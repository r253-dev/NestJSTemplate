import { Injectable } from '@nestjs/common';
import { AdminManageUserUsecase } from './admin-manage-user.usecase';
import { UserEntity } from './entities/user.entity';
import { PaginationDto } from 'share/dto/pagination.dto';
import { State } from 'share/entities/user.core.entity';
import { AdminManageTenantService } from 'admin/admin-manage-tenant/admin-manage-tenant.service';
import { TenantEntity } from './entities/tenant.entity';

type UserCreationParams = {
  code: string;
  password: string;
  email: string | null;
  name: string;
  displayName: string;
};

@Injectable()
export class AdminManageUserService {
  constructor(
    private tenantService: AdminManageTenantService,
    private usecase: AdminManageUserUsecase,
  ) {}

  async create(tenantUuid: string, params: UserCreationParams): Promise<UserEntity> {
    const tenant = await this.findTenantByUuid(tenantUuid);
    const user = await this.usecase.create(tenant, params);
    return user;
  }

  async remove(tenantUuid: string, uuid: string): Promise<void> {
    const tenant = await this.findTenantByUuid(tenantUuid);
    const user = await this.usecase.find(tenant, { uuid });
    await this.usecase.remove(tenant, user);
  }

  async findAll(tenantUuid: string, pagination: PaginationDto): Promise<UserEntity[]> {
    const tenant = await this.findTenantByUuid(tenantUuid);
    const users = await this.usecase.findAll(tenant, pagination);
    return users;
  }

  async findAllRemoved(tenantUuid: string, pagination: PaginationDto): Promise<UserEntity[]> {
    const tenant = await this.findTenantByUuid(tenantUuid);
    const users = await this.usecase.findAll(tenant, pagination, {
      states: [State.REMOVED],
    });
    return users;
  }

  async findByUuid(tenantUuid: string, uuid: string): Promise<UserEntity> {
    const tenant = await this.findTenantByUuid(tenantUuid);
    const user = await this.usecase.find(tenant, { uuid });
    return user;
  }

  private async findTenantByUuid(uuid: string): Promise<TenantEntity> {
    const tenant = await this.tenantService.findByUuid(uuid);
    return TenantEntity.fromEntity(tenant);
  }
}
