import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdministratorModel } from 'share/models/administrator.model';
import { save } from 'share/repository';

@Injectable()
export class AdminRegistrationRepository {
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

  async save(entity: AdministratorEntity): Promise<void> {
    await save(entity);
  }
}
