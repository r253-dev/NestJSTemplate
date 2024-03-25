import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereAttributeHash } from 'sequelize';
import { buildPaginationCondition, save } from 'share/repository';
import { OrganizationEntity } from './entities/organization.entity';
import { PaginationDto } from 'share/dto/pagination.dto';
import { TenantEntity } from './entities/tenant.entity';
import { OrganizationEntityCore, State } from 'share/entities/organization.core.entity';
import { OrganizationModel } from 'share/models/organization.model';

export type Condition = {
  states?: State[];
  uuid?: string;
  code?: string;
};

@Injectable()
export class UserManageOrganizationRepository {
  constructor(
    @InjectModel(OrganizationModel)
    private organizationModel: typeof OrganizationModel,
  ) {}

  buildCondition(tenant: TenantEntity, condition?: Condition): WhereAttributeHash | undefined {
    const where: WhereAttributeHash = {
      tenantId: tenant.id,
    };

    if (condition === undefined) {
      return where;
    }

    if (condition.states !== undefined) {
      if (condition.states.length > 0) {
        where.state = condition.states.map(OrganizationEntityCore.toModel$state);
      }
    }

    if (condition.uuid !== undefined) {
      where.uuid = condition.uuid;
    }

    if (condition.code !== undefined) {
      where.code = condition.code;
    }

    return where;
  }

  async findAll(
    tenant: TenantEntity,
    pagination: PaginationDto,
    condition?: Condition,
  ): Promise<OrganizationEntity[]> {
    const models = await this.organizationModel.findAll({
      ...buildPaginationCondition(pagination),
      where: this.buildCondition(tenant, condition),
    });
    return models.map((model) => OrganizationEntity.fromModel(model));
  }

  async find(tenant: TenantEntity, condition?: Condition): Promise<OrganizationEntity | null> {
    const model = await this.organizationModel.findOne({
      where: this.buildCondition(tenant, condition),
    });
    if (model === null) {
      return null;
    }
    return OrganizationEntity.fromModel(model);
  }

  async save(entity: OrganizationEntity): Promise<void> {
    await save(entity);
  }
}
