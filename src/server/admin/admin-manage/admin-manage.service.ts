import { ConflictException, Injectable } from '@nestjs/common';
import { AdminManageUsecase } from './admin-manage.usecase';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdminManageResponseDto } from './dto/admin-manage-response.dto';
import { PaginationDto } from 'share/dto/pagination.dto';
import { State } from 'share/entities/administrator.core.entity';

@Injectable()
export class AdminManageService {
  constructor(private usecase: AdminManageUsecase) {}

  async create(email: string, password: string): Promise<AdminManageResponseDto> {
    if (await this.usecase.existsByEmail(email)) {
      throw new ConflictException();
    }
    const administrator = await this.usecase.create(email, password);
    return this.toResponse(administrator);
  }

  async remove(uuid: string): Promise<void> {
    const administrator = await this.usecase.findByUuid(uuid);
    await this.usecase.remove(administrator);
  }

  async findAll(pagination: PaginationDto): Promise<AdminManageResponseDto[]> {
    const administrators = await this.usecase.findAll(pagination);
    return administrators.map(this.toResponse);
  }

  async findAllRemoved(pagination: PaginationDto): Promise<AdminManageResponseDto[]> {
    const administrators = await this.usecase.findAll(pagination, { states: [State.REMOVED] });
    return administrators.map(this.toResponse);
  }

  async findByUuid(uuid: string): Promise<AdminManageResponseDto> {
    const administrator = await this.usecase.findByUuid(uuid);
    return this.toResponse(administrator);
  }

  private toResponse(administrator: AdministratorEntity): AdminManageResponseDto {
    return {
      uuid: administrator.uuid,
      email: administrator.email,
      createdAt: administrator.createdAt,
    };
  }
}
