import { Controller, UsePipes, HttpStatus, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { AdminManageService } from './admin-manage.service';

import { Swagger } from 'share/decorators/swagger';
import { AdminManageResponseDto } from './dto/admin-manage-response.dto';
import { AdminManageCreationDto } from './dto/admin-manage-create-dto';
import { ApiPagination, Pagination } from 'share/decorators/pagination.decorator';
import { PaginationDto } from 'share/dto/pagination.dto';

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
    return await this.service.create(creationDto.email, creationDto.password);
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
    return await this.service.findAll(pagination);
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
    return await this.service.findAllRemoved(pagination);
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
    return await this.service.findByUuid(uuid);
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
}
