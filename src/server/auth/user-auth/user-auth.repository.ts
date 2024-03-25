import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';
import { UserModel } from 'share/models/user.model';
import { TenantModel } from 'share/models/tenant.model';

@Injectable()
export class UserAuthRepository {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  async findByCode(tenantCode: string, code: string): Promise<UserEntity | null> {
    const model = await this.userModel.findOne({
      attributes: {
        include: ['passwordHash'],
      },
      where: {
        code: code,
      },
      include: [
        {
          model: TenantModel,
          required: true,
          where: {
            code: tenantCode,
          },
        },
      ],
    });
    if (model === null) {
      return null;
    }
    return UserEntity.fromModel(model);
  }

  async findByTenantUuidAndUuid(tenantUuid: string, uuid: string): Promise<UserEntity | null> {
    const model = await this.userModel.findOne({
      where: {
        uuid: uuid,
      },
      include: [
        {
          model: TenantModel,
          required: true,
          where: {
            uuid: tenantUuid,
          },
        },
      ],
    });
    if (model === null) {
      return null;
    }
    return UserEntity.fromModel(model);
  }
}
