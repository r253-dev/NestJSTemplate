import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereAttributeHash } from 'sequelize';
import { buildPaginationCondition, save } from 'share/repository';
import { TenantEntity } from './entities/tenant.entity';
import { PaginationDto } from 'share/dto/pagination.dto';
import { TenantModel } from 'share/models/tenant.model';
import { TenantEntityCore, State } from 'share/entities/tenant.core.entity';

export type Condition = {
  states: State[];
};

@Injectable()
export class AdminManageTenantRepository {
  constructor(
    @InjectModel(TenantModel)
    private tenantModel: typeof TenantModel,
  ) {}

  buildCondition(condition?: Condition): WhereAttributeHash | undefined {
    const where: WhereAttributeHash = {};
    if (condition === undefined) {
      return condition;
    }

    if (condition.states.length > 0) {
      where.state = condition.states.map(TenantEntityCore.toModel$state);
    }
    return where;
  }

  async findAll(pagination: PaginationDto, condition?: Condition): Promise<TenantEntity[]> {
    const models = await this.tenantModel.findAll({
      ...buildPaginationCondition(pagination),
      where: this.buildCondition(condition),
    });
    return models.map((model) => TenantEntity.fromModel(model));
  }

  async count(condition?: Condition): Promise<number> {
    return await this.tenantModel.count({
      where: this.buildCondition(condition),
    });
  }

  async findByUuid(uuid: string): Promise<TenantEntity | null> {
    const model = await this.tenantModel.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (model === null) {
      return null;
    }
    return TenantEntity.fromModel(model);
  }

  async findByCode(code: string): Promise<TenantEntity | null> {
    const model = await this.tenantModel.findOne({
      where: {
        code,
      },
    });
    if (model === null) {
      return null;
    }
    return TenantEntity.fromModel(model);
  }

  async save(entity: TenantEntity): Promise<void> {
    await save(entity);
  }
}
