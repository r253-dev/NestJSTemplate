import { Controller, UsePipes, HttpStatus, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { AdminManageUserService } from './admin-manage-user.service';

import { Swagger } from 'share/decorators/swagger';
import { AdminManageUserResponseDto } from './dto/admin-manage-user-response.dto';
import { AdminManageUserCreationDto } from './dto/admin-manage-user-creation-dto';
import { ApiPagination, Pagination } from 'share/decorators/pagination.decorator';
import { PaginationDto } from 'share/dto/pagination.dto';

@Controller('admin/~/tenants/:tenantUuid/users')
@ApiTags('user', '管理者のユーザー管理モジュール')
@UsePipes(ZodValidationPipe)
export class AdminManageUserController {
  constructor(private readonly service: AdminManageUserService) {}

  @Post()
  @Swagger({
    operationId: 'createUser',
    summary: 'ユーザーを作成する',
    description: 'ユーザーを作成する',
    body: { type: AdminManageUserCreationDto },
    responses: [
      {
        status: HttpStatus.CREATED,
        type: AdminManageUserResponseDto,
      },
      { status: HttpStatus.CONFLICT, description: '既にメールアドレスが登録されている' },
      { status: HttpStatus.CONFLICT, description: '既にコードが登録されている' },
    ],
  })
  async create(
    @Param('tenantUuid') tenantUuid: string,
    @Body() creationDto: AdminManageUserCreationDto,
  ): Promise<AdminManageUserResponseDto> {
    // emailはoptional, 未指定時はnull
    const email = creationDto.email || null;
    const user = await this.service.create(
      tenantUuid,
      creationDto.code,
      creationDto.password,
      email,
    );
    return this.service.toResponse(user);
  }

  @Get()
  @ApiPagination()
  @Swagger({
    operationId: 'getUsers',
    summary: 'ユーザーの一覧を取得する',
    description: 'ユーザーの一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageUserResponseDto,
        isArray: true,
      },
    ],
  })
  async findAll(
    @Param('tenantUuid') tenantUuid: string,
    @Pagination() pagination: PaginationDto,
  ): Promise<AdminManageUserResponseDto[]> {
    const users = await this.service.findAll(tenantUuid, pagination);
    return users.map(this.service.toResponse);
  }

  @Get('@removed')
  @ApiPagination()
  @Swagger({
    operationId: 'getRemovedUsers',
    summary: '削除されたユーザーの一覧を取得する',
    description: '削除されたユーザーの一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageUserResponseDto,
        isArray: true,
      },
    ],
  })
  async findAllRemoved(
    @Param('tenantUuid') tenantUuid: string,
    @Pagination() pagination: PaginationDto,
  ): Promise<AdminManageUserResponseDto[]> {
    const users = await this.service.findAllRemoved(tenantUuid, pagination);
    return users.map(this.service.toResponse);
  }

  @Get(':uuid')
  @Swagger({
    operationId: 'getUser',
    summary: 'ユーザーを取得する',
    description: 'ユーザーを取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageUserResponseDto,
      },
    ],
  })
  async findByUuid(
    @Param('tenantUuid') tenantUuid: string,
    @Param('uuid') uuid: string,
  ): Promise<AdminManageUserResponseDto> {
    const user = await this.service.findByUuid(tenantUuid, uuid);
    return this.service.toResponse(user);
  }

  @Delete(':uuid')
  @Swagger({
    operationId: 'removeUser',
    summary: 'ユーザーを削除する',
    description: 'ユーザーを削除する',
    responses: [
      {
        status: HttpStatus.NO_CONTENT,
      },
    ],
  })
  async remove(
    @Param('tenantUuid') tenantUuid: string,
    @Param('uuid') uuid: string,
  ): Promise<void> {
    await this.service.remove(tenantUuid, uuid);
  }
}
