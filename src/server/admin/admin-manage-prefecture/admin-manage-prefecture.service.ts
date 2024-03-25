import { Injectable } from '@nestjs/common';
import { AdminManagePrefectureUsecase } from './admin-manage-prefecture.usecase';
import { PrefectureEntity } from './entities/prefecture.entity';

@Injectable()
export class AdminManagePrefectureService {
  constructor(private usecase: AdminManagePrefectureUsecase) {}

  async create(code: string, name: string, nameKana: string): Promise<PrefectureEntity> {
    return await this.usecase.create(code, name, nameKana);
  }

  async findAll(): Promise<PrefectureEntity[]> {
    return await this.usecase.findAll();
  }

  async count(): Promise<number> {
    return await this.usecase.count();
  }

  async findByUuid(uuid: string): Promise<PrefectureEntity> {
    return await this.usecase.findByUuid(uuid);
  }
}
