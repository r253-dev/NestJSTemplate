import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereAttributeHash } from 'sequelize';
import { buildPaginationCondition, save } from 'share/repository';
import { PaginationDto } from 'share/dto/pagination.dto';
import { TenantEntity } from './entities/tenant.entity';
import { UserEntity, State } from './entities/user.entity';
import { UserModel } from 'share/models/user.model';

export type Condition = {
  states?: State[];
  uuid?: string;
  code?: string;
  email?: string;
};

@Injectable()
export class UserManageUserRepository {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  buildCondition(tenant: TenantEntity, condition?: Condition): WhereAttributeHash | undefined {
    const where: WhereAttributeHash = {
      tenantId: tenant.id,
    };

    if (condition === undefined) {
      return where;
    }

    if (condition.states !== undefined) {
      if (condition.states.length > 0) {
        where.state = condition.states.map(UserEntity.toModel$state);
      }
    }

    if (condition.uuid !== undefined) {
      where.uuid = condition.uuid;
    }

    if (condition.code !== undefined) {
      where.code = condition.code;
    }

    if (condition.email !== undefined) {
      where.email = condition.email;
    }

    return where;
  }

  async findAll(
    tenant: TenantEntity,
    pagination: PaginationDto,
    condition?: Condition,
  ): Promise<UserEntity[]> {
    const models = await this.userModel.findAll({
      ...buildPaginationCondition(pagination),
      where: this.buildCondition(tenant, condition),
    });
    return models.map((model) => UserEntity.fromModel(model));
  }

  async find(tenant: TenantEntity, condition?: Condition): Promise<UserEntity | null> {
    const model = await this.userModel.findOne({
      where: this.buildCondition(tenant, condition),
    });
    if (model === null) {
      return null;
    }
    return UserEntity.fromModel(model);
  }

  async save(entity: UserEntity): Promise<void> {
    await save(entity);
  }
}
