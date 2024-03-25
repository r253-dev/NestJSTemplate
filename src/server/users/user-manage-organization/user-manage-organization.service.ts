import { Injectable } from '@nestjs/common';
import { UserManageOrganizationUsecase } from './user-manage-organization.usecase';
import { OrganizationEntity } from './entities/organization.entity';
import { PaginationDto } from 'share/dto/pagination.dto';
import { AdminManageTenantService } from 'admin/admin-manage-tenant/admin-manage-tenant.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserManageOrganizationService {
  constructor(
    private tenantService: AdminManageTenantService,
    private usecase: UserManageOrganizationUsecase,
  ) {}

  async create(
    user: UserEntity,
    code: string | null,
    name: string,
    nameKana: string,
  ): Promise<OrganizationEntity> {
    const organization = await this.usecase.create(user.tenant, code, name, nameKana);
    return organization;
  }

  async remove(user: UserEntity, uuid: string): Promise<void> {
    const organization = await this.usecase.find(user.tenant, { uuid });
    await this.usecase.remove(organization);
  }

  async findAll(user: UserEntity, pagination: PaginationDto): Promise<OrganizationEntity[]> {
    return await this.usecase.findAll(user.tenant, pagination);
  }

  async findByUuid(user: UserEntity, uuid: string): Promise<OrganizationEntity> {
    return await this.usecase.find(user.tenant, { uuid });
  }
}
