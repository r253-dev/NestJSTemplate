import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantEntity } from './entities/tenant.entity';
import { AdminManageTenantRepository, Condition } from './admin-manage-tenant.repository';
import { PaginationDto } from 'share/dto/pagination.dto';

@Injectable()
export class AdminManageTenantUsecase {
  constructor(private repository: AdminManageTenantRepository) {}

  async create(code: string): Promise<TenantEntity> {
    const tenant = TenantEntity.factory(code);
    await this.repository.save(tenant);
    return tenant;
  }

  async remove(tenant: TenantEntity): Promise<void> {
    tenant.remove();
    await this.repository.save(tenant);
  }

  async findAll(pagination: PaginationDto, condition?: Condition): Promise<TenantEntity[]> {
    return await this.repository.findAll(pagination, condition);
  }

  async count(condition?: Condition): Promise<number> {
    return await this.repository.count(condition);
  }

  async findByUuid(uuid: string): Promise<TenantEntity> {
    const tenant = await this.repository.findByUuid(uuid);
    if (tenant === null) {
      throw new NotFoundException();
    }
    return tenant;
  }

  async existsByCode(code: string): Promise<boolean> {
    try {
      await this.findByCode(code);
      return true;
    } catch (e) {
      if (e instanceof NotFoundException) {
        return false;
      }
      throw e;
    }
  }

  private async findByCode(code: string): Promise<TenantEntity> {
    const tenant = await this.repository.findByCode(code);
    if (tenant === null) {
      throw new NotFoundException();
    }
    return tenant;
  }
}
