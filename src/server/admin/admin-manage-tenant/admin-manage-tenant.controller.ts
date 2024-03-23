import { Controller, UsePipes, HttpStatus, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { AdminManageTenantService } from './admin-manage-tenant.service';

import { Swagger } from 'share/decorators/swagger';
import { AdminManageTenantCreationDto } from './dto/admin-manage-tenant-create-dto';
import { ApiPagination, Pagination } from 'share/decorators/pagination.decorator';
import { PaginationDto } from 'share/dto/pagination.dto';
import { AdminManageTenantResponseDto } from './dto/admin-manage-tenant-response.dto';
import { TenantEntity } from './entities/tenant.entity';

@Controller('admin/~/tenants')
@ApiTags('tenant', '管理者によるテナント管理モジュール')
@UsePipes(ZodValidationPipe)
export class AdminManageTenantController {
  constructor(private readonly service: AdminManageTenantService) {}

  @Post()
  @Swagger({
    operationId: 'createTenantForAdmin',
    summary: 'テナントを作成する',
    description: 'テナントを作成する',
    body: { type: AdminManageTenantCreationDto },
    responses: [
      {
        status: HttpStatus.CREATED,
        type: AdminManageTenantResponseDto,
      },
      { status: HttpStatus.CONFLICT, description: '既にコードが登録されている' },
    ],
  })
  async create(
    @Body() creationDto: AdminManageTenantCreationDto,
  ): Promise<AdminManageTenantResponseDto> {
    const tenant = await this.service.create(creationDto.code);
    return this.toResponse(tenant);
  }

  @Get()
  @ApiPagination()
  @Swagger({
    operationId: 'getTenantsForAdmin',
    summary: 'テナントの一覧を取得する',
    description: 'テナントの一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageTenantResponseDto,
        isArray: true,
      },
    ],
  })
  async findAll(@Pagination() pagination: PaginationDto): Promise<AdminManageTenantResponseDto[]> {
    const tenants = await this.service.findAll(pagination);
    return tenants.map(this.toResponse);
  }

  @Get('@removed')
  @ApiPagination()
  @Swagger({
    operationId: 'getRemovedTenantsForAdmin',
    summary: '削除されたテナントの一覧を取得する',
    description: '削除されたテナントの一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageTenantResponseDto,
        isArray: true,
      },
    ],
  })
  async findAllRemoved(
    @Pagination() pagination: PaginationDto,
  ): Promise<AdminManageTenantResponseDto[]> {
    const tenants = await this.service.findAllRemoved(pagination);
    return tenants.map(this.toResponse);
  }

  @Get('count')
  @Swagger({
    operationId: 'countTenantForAdmin',
    summary: 'テナントの数を取得する',
    description: 'テナントの数を取得する',
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

  @Get('@removed/count')
  @Swagger({
    operationId: 'countRemovedTenantForAdmin',
    summary: '削除されたテナントの数を取得する',
    description: '削除されたテナントの数を取得する',
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
    operationId: 'getTenantForAdmin',
    summary: 'テナントを取得する',
    description: 'テナントを取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManageTenantResponseDto,
      },
    ],
  })
  async findByUuid(@Param('uuid') uuid: string): Promise<AdminManageTenantResponseDto> {
    const tenant = await this.service.findByUuid(uuid);
    return this.toResponse(tenant);
  }

  @Delete(':uuid')
  @Swagger({
    operationId: 'removeTenant',
    summary: 'テナントを削除する',
    description: 'テナントを削除する',
    responses: [{ status: HttpStatus.NO_CONTENT }],
  })
  async remove(@Param('uuid') uuid: string): Promise<void> {
    await this.service.remove(uuid);
  }

  private toResponse(tenant: TenantEntity): AdminManageTenantResponseDto {
    return {
      uuid: tenant.uuid,
      code: tenant.code,
    };
  }
}
