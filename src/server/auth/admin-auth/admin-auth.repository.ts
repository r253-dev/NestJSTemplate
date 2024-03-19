import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdministratorModel } from 'share/models/administrator.model';
import { AdministratorEntity } from './entities/administrator.entity';

@Injectable()
export class AdminAuthRepository {
  constructor(
    @InjectModel(AdministratorModel)
    private administratorModel: typeof AdministratorModel,
  ) {}

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
}
