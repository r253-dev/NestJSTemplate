import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PrefectureModel } from 'share/models/prefecture.model';
import { save } from 'share/repository';
import { PrefectureEntity } from './entities/prefecture.entity';

@Injectable()
export class AdminManagePrefectureRepository {
  constructor(
    @InjectModel(PrefectureModel)
    private prefectureModel: typeof PrefectureModel,
  ) {}

  async findAll(): Promise<PrefectureEntity[]> {
    const models = await this.prefectureModel.findAll();
    return models.map((model) => PrefectureEntity.fromModel(model));
  }

  async count(): Promise<number> {
    return await this.prefectureModel.count();
  }

  async findByUuid(uuid: string): Promise<PrefectureEntity | null> {
    const model = await this.prefectureModel.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (model === null) {
      return null;
    }
    return PrefectureEntity.fromModel(model);
  }

  async findByCode(code: string): Promise<PrefectureEntity | null> {
    const model = await this.prefectureModel.findOne({
      where: {
        code: code,
      },
    });
    if (model === null) {
      return null;
    }
    return PrefectureEntity.fromModel(model);
  }

  async save(entity: PrefectureEntity): Promise<void> {
    await save(entity);
  }
}
