import { Injectable, NotFoundException } from '@nestjs/common';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdminManageRepository, Condition } from './admin-manage.repository';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';
import { PaginationDto } from 'share/dto/pagination.dto';

@Injectable()
export class AdminManageUsecase {
  constructor(
    private repository: AdminManageRepository,
    private bcrypt: BcryptService,
  ) {}

  async create(email: string, password: string): Promise<AdministratorEntity> {
    const passwordHash = await this.bcrypt.hash(password, 10);
    const administrator = AdministratorEntity.factory(email, passwordHash);
    await this.repository.save(administrator);
    return administrator;
  }

  async remove(administrator: AdministratorEntity): Promise<void> {
    administrator.remove();
    await this.repository.save(administrator);
  }

  async findAll(pagination: PaginationDto, condition?: Condition): Promise<AdministratorEntity[]> {
    return await this.repository.findAll(pagination, condition);
  }

  async count(condition?: Condition): Promise<number> {
    return await this.repository.count(condition);
  }

  async findByUuid(uuid: string): Promise<AdministratorEntity> {
    const administrator = await this.repository.findByUuid(uuid);
    if (administrator === null) {
      throw new NotFoundException();
    }
    return administrator;
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      await this.findByEmail(email);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async findByEmail(email: string): Promise<AdministratorEntity> {
    const administrator = await this.repository.findByEmail(email);
    if (administrator === null) {
      throw new NotFoundException();
    }
    return administrator;
  }
}
