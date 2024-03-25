import { ConflictException, Injectable } from '@nestjs/common';
import { AdminManageUsecase } from './admin-manage.usecase';
import { AdministratorEntity } from './entities/administrator.entity';
import { PaginationDto } from 'share/dto/pagination.dto';
import { State } from 'share/entities/administrator.core.entity';

@Injectable()
export class AdminManageService {
  constructor(private usecase: AdminManageUsecase) {}

  async create(email: string, password: string): Promise<AdministratorEntity> {
    if (await this.usecase.existsByEmail(email)) {
      throw new ConflictException();
    }
    return await this.usecase.create(email, password);
  }

  async remove(uuid: string): Promise<void> {
    const administrator = await this.usecase.findByUuid(uuid);
    await this.usecase.remove(administrator);
  }

  async findAll(pagination: PaginationDto): Promise<AdministratorEntity[]> {
    return await this.usecase.findAll(pagination);
  }

  async count(): Promise<number> {
    return await this.usecase.count();
  }

  async findAllRemoved(pagination: PaginationDto): Promise<AdministratorEntity[]> {
    return await this.usecase.findAll(pagination, { states: [State.REMOVED] });
  }

  async countRemoved(): Promise<number> {
    return await this.usecase.count({ states: [State.REMOVED] });
  }

  async findByUuid(uuid: string): Promise<AdministratorEntity> {
    return await this.usecase.findByUuid(uuid);
  }
}
