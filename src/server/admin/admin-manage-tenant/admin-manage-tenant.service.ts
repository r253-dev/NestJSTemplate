import { ConflictException, Injectable } from '@nestjs/common';
import { AdminManageTenantUsecase } from './admin-manage-tenant.usecase';
import { TenantEntity } from './entities/tenant.entity';
import { AdminManageTenantResponseDto } from './dto/admin-manage-tenant-response.dto';
import { PaginationDto } from 'share/dto/pagination.dto';
import { State } from 'share/entities/tenant.core.entity';

@Injectable()
export class AdminManageTenantService {
  constructor(private usecase: AdminManageTenantUsecase) {}

  async create(code: string): Promise<AdminManageTenantResponseDto> {
    if (await this.usecase.existsByCode(code)) {
      throw new ConflictException('指定されたコードは既に使用されています');
    }
    const tenant = await this.usecase.create(code);
    return this.toResponse(tenant);
  }

  async remove(uuid: string): Promise<void> {
    const tenant = await this.usecase.findByUuid(uuid);
    await this.usecase.remove(tenant);
  }

  async findAll(pagination: PaginationDto): Promise<AdminManageTenantResponseDto[]> {
    const tenants = await this.usecase.findAll(pagination);
    return tenants.map(this.toResponse);
  }

  async findAllRemoved(pagination: PaginationDto): Promise<AdminManageTenantResponseDto[]> {
    const tenants = await this.usecase.findAll(pagination, { states: [State.REMOVED] });
    return tenants.map(this.toResponse);
  }

  async count(): Promise<number> {
    return await this.usecase.count();
  }

  async countRemoved(): Promise<number> {
    return await this.usecase.count({ states: [State.REMOVED] });
  }

  async findByUuid(uuid: string): Promise<AdminManageTenantResponseDto> {
    const tenant = await this.usecase.findByUuid(uuid);
    return this.toResponse(tenant);
  }

  private toResponse(tenant: TenantEntity): AdminManageTenantResponseDto {
    return {
      uuid: tenant.uuid,
      code: tenant.code,
    };
  }
}
