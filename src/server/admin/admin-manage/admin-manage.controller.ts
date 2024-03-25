import { Controller, UsePipes, HttpStatus, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { AdminManageService } from './admin-manage.service';

import { Swagger } from 'share/decorators/swagger';
import { AdminManageResponseDto } from './dto/admin-manage-response.dto';
import { AdminManageCreationDto } from './dto/admin-manage-create-dto';
import { ApiPagination, Pagination } from 'share/decorators/pagination.decorator';
import { PaginationDto } from 'share/dto/pagination.dto';
import { AdministratorEntity } from './entities/administrator.entity';

@Controller('admin/~/administrators')
@ApiTags('administrator', '管理者の管理モジュール')
@UsePipes(ZodValidationPipe)
export class AdminManageController {
  constructor(private readonly service: AdminManageService) {}

  @Post()
  @Swagger({
    operationId: 'createAdministrator',
    summary: '管理者を作成する',
    description: '管理者を作成する',
    body: { type: AdminManageCreationDto },
    responses: [
      {
        status: HttpStatus.CREATED,
        type: AdminManageResponseDto,
      },
      { status: HttpStatus.CONFLICT, description: '既にメールアドレスが登録されている' },
    ],
  })
  async create(@Body() creationDto: AdminManageCreationDto): Promise<AdminManageResponseDto> {
    const administrator = await this.service.create(creationDto.email, creationDto.password);
    return this.toResponse(administrator);
  }

  @Get()
  @ApiPagination()
  @Swagger({
    operationId: 'getAdministrators',
    summary: '管理者の一覧を取得する',
    description: '管理者の一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageResponseDto,
        isArray: true,
      },
    ],
  })
  async findAll(@Pagination() pagination: PaginationDto): Promise<AdminManageResponseDto[]> {
    const administrators = await this.service.findAll(pagination);
    return administrators.map(this.toResponse);
  }

  @Get('count')
  @Swagger({
    operationId: 'countAdministrator',
    summary: '管理者数を取得する',
    description: '管理者数を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: Number,
      },
    ],
  })
  async count(): Promise<number> {
    return await this.service.count();
  }

  @Get('@removed')
  @ApiPagination()
  @Swagger({
    operationId: 'getRemovedAdministrators',
    summary: '削除された管理者の一覧を取得する',
    description: '削除された管理者の一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageResponseDto,
        isArray: true,
      },
    ],
  })
  async findAllRemoved(@Pagination() pagination: PaginationDto): Promise<AdminManageResponseDto[]> {
    const administrators = await this.service.findAllRemoved(pagination);
    return administrators.map(this.toResponse);
  }

  @Get('@removed/count')
  @Swagger({
    operationId: 'countRemovedAdministrator',
    summary: '削除された管理者数を取得する',
    description: '削除された管理者数を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: Number,
      },
    ],
  })
  async countRemoved(): Promise<number> {
    return await this.service.countRemoved();
  }

  @Get(':uuid')
  @Swagger({
    operationId: 'getAdministrator',
    summary: '管理者を取得する',
    description: '管理者を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageResponseDto,
      },
    ],
  })
  async findByUuid(@Param('uuid') uuid: string): Promise<AdminManageResponseDto> {
    const administrator = await this.service.findByUuid(uuid);
    return this.toResponse(administrator);
  }

  @Delete(':uuid')
  @Swagger({
    operationId: 'removeAdministrator',
    summary: '管理者を削除する',
    description: '管理者を削除する',
    responses: [
      {
        status: HttpStatus.NO_CONTENT,
      },
    ],
  })
  async remove(@Param('uuid') uuid: string): Promise<void> {
    await this.service.remove(uuid);
  }

  private toResponse(administrator: AdministratorEntity): AdminManageResponseDto {
    return {
      uuid: administrator.uuid,
      email: administrator.email,
      createdAt: administrator.createdAt,
    };
  }
}
