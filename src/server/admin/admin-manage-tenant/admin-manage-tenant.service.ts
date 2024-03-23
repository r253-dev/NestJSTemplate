import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'share/dto/pagination.dto';
import { State } from 'share/entities/tenant.core.entity';
import { TenantEntity } from './entities/tenant.entity';
import { AdminManageTenantUsecase } from './admin-manage-tenant.usecase';

@Injectable()
export class AdminManageTenantService {
  constructor(private usecase: AdminManageTenantUsecase) {}

  async create(code: string): Promise<TenantEntity> {
    const tenant = await this.usecase.create(code);
    return tenant;
  }

  async remove(uuid: string): Promise<void> {
    const tenant = await this.usecase.findByUuid(uuid);
    await this.usecase.remove(tenant);
  }

  async findAll(pagination: PaginationDto): Promise<TenantEntity[]> {
    const tenants = await this.usecase.findAll(pagination);
    return tenants;
  }

  async findAllRemoved(pagination: PaginationDto): Promise<TenantEntity[]> {
    const tenants = await this.usecase.findAll(pagination, { states: [State.REMOVED] });
    return tenants;
  }

  async count(): Promise<number> {
    return await this.usecase.count();
  }

  async countRemoved(): Promise<number> {
    return await this.usecase.count({ states: [State.REMOVED] });
  }

  async findByUuid(uuid: string): Promise<TenantEntity> {
    const tenant = await this.usecase.findByUuid(uuid);
    return tenant;
  }
}
