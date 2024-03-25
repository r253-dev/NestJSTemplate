import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrefectureEntity } from './entities/prefecture.entity';
import { AdminManagePrefectureRepository } from './admin-manage-prefecture.repository';

@Injectable()
export class AdminManagePrefectureUsecase {
  constructor(private repository: AdminManagePrefectureRepository) {}

  async create(code: string, name: string, nameKana: string): Promise<PrefectureEntity> {
    if (await this.existsByCode(code)) {
      throw new ConflictException();
    }
    const prefecture = PrefectureEntity.factory(code, name, nameKana);
    await this.repository.save(prefecture);
    return prefecture;
  }

  async findAll(): Promise<PrefectureEntity[]> {
    return await this.repository.findAll();
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async findByUuid(uuid: string): Promise<PrefectureEntity> {
    const prefecture = await this.repository.findByUuid(uuid);
    if (prefecture === null) {
      throw new NotFoundException();
    }
    return prefecture;
  }

  private async existsByCode(code: string): Promise<boolean> {
    try {
      await this.findByCode(code);
      return true;
    } catch (e) {
      return false;
    }
  }

  async findByCode(code: string): Promise<PrefectureEntity> {
    const prefecture = await this.repository.findByCode(code);
    if (prefecture === null) {
      throw new NotFoundException();
    }
    return prefecture;
  }
}
