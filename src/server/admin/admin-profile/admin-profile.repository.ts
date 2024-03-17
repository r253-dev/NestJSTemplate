import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdministratorModel } from 'share/models/administrator.model';

@Injectable()
export class AdminProfileRepository {
  constructor(
    @InjectModel(AdministratorModel)
    private administratorModel: typeof AdministratorModel,
  ) {}
  async count(): Promise<number> {
    return await this.administratorModel.count();
  }
}
