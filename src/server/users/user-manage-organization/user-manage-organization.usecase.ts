import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationEntity } from './entities/organization.entity';
import { PaginationDto } from 'share/dto/pagination.dto';
import { UserManageOrganizationRepository, Condition } from './user-manage-organization.repository';
import { TenantEntity } from './entities/tenant.entity';

@Injectable()
export class UserManageOrganizationUsecase {
  constructor(private repository: UserManageOrganizationRepository) {}

  async create(
    tenant: TenantEntity,
    code: string | null,
    name: string,
    nameKana: string,
  ): Promise<OrganizationEntity> {
    if (await this.existsByCode(tenant, code)) {
      throw new ConflictException('指定されたコードは既に使用されています');
    }
    const organization = OrganizationEntity.factory(tenant, code, name, nameKana);
    await this.repository.save(organization);
    return organization;
  }

  async remove(organization: OrganizationEntity): Promise<void> {
    organization.remove();
    await this.repository.save(organization);
  }

  async findAll(
    tenant: TenantEntity,
    pagination: PaginationDto,
    condition?: Condition,
  ): Promise<OrganizationEntity[]> {
    return await this.repository.findAll(tenant, pagination, condition);
  }

  async find(tenant: TenantEntity, condition?: Condition): Promise<OrganizationEntity> {
    const organization = await this.repository.find(tenant, condition);
    if (organization === null) {
      throw new NotFoundException('指定された事業所は存在しません');
    }
    return organization;
  }

  private async existsByCode(tenant: TenantEntity, code: string | null): Promise<boolean> {
    if (code === null) {
      return false;
    }
    try {
      await this.findByCode(tenant, code);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async findByCode(tenant: TenantEntity, code: string): Promise<OrganizationEntity> {
    const organization = await this.repository.find(tenant, { code });
    if (organization === null) {
      throw new NotFoundException('指定されたコードの事業所は存在しません');
    }
    return organization;
  }
}
