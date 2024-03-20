import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereAttributeHash } from 'sequelize';
import { AdministratorModel } from 'share/models/administrator.model';
import { buildPaginationCondition, save } from 'share/repository';
import { AdministratorEntityCore, State } from 'share/entities/administrator.core.entity';
import { AdministratorEntity } from './entities/administrator.entity';
import { PaginationDto } from 'share/dto/pagination.dto';

export type Condition = {
  states: State[];
};

@Injectable()
export class AdminManageRepository {
  constructor(
    @InjectModel(AdministratorModel)
    private administratorModel: typeof AdministratorModel,
  ) {}

  buildCondition(condition?: Condition): WhereAttributeHash | undefined {
    const where: WhereAttributeHash = {};
    if (condition === undefined) {
      return condition;
    }

    if (condition.states.length > 0) {
      where.state = condition.states.map(AdministratorEntityCore.toModel$state);
    }
    return where;
  }

  async findAll(pagination: PaginationDto, condition?: Condition): Promise<AdministratorEntity[]> {
    const models = await this.administratorModel.findAll({
      ...buildPaginationCondition(pagination),
      where: this.buildCondition(condition),
    });
    return models.map((model) => AdministratorEntity.fromModel(model));
  }

  async findByUuid(uuid: string): Promise<AdministratorEntity | null> {
    const model = await this.administratorModel.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (model === null) {
      return null;
    }
    return AdministratorEntity.fromModel(model);
  }

  async findByEmail(email: string): Promise<AdministratorEntity | null> {
    const model = await this.administratorModel.findOne({
      where: {
        email: email,
      },
    });
    if (model === null) {
      return null;
    }
    return AdministratorEntity.fromModel(model);
  }

  async save(entity: AdministratorEntity): Promise<void> {
    await save(entity);
  }
}
