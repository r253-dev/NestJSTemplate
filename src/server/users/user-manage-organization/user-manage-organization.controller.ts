import { Controller, UsePipes, HttpStatus, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { UserManageOrganizationService } from './user-manage-organization.service';

import { Swagger } from 'share/decorators/swagger';
import { UserManageOrganizationResponseDto } from './dto/user-manage-organization-response.dto';
import { UserManageOrganizationCreationDto } from './dto/user-manage-organization-creation-dto';
import { ApiPagination, Pagination } from 'share/decorators/pagination.decorator';
import { PaginationDto } from 'share/dto/pagination.dto';
import { User } from 'share/decorators/user';
import { UserEntity } from 'auth/user-auth/entities/user.entity';
import { OrganizationEntity } from './entities/organization.entity';

@Controller('users/~/organizations')
@ApiTags('organization', 'ユーザーの事業所管理モジュール')
@UsePipes(ZodValidationPipe)
export class UserManageOrganizationController {
  constructor(private readonly service: UserManageOrganizationService) {}

  @Post()
  @Swagger({
    operationId: 'createOrganizationForUser',
    summary: '事業所を登録する',
    description: '事業所を登録する',
    body: { type: UserManageOrganizationCreationDto },
    responses: [
      {
        status: HttpStatus.CREATED,
        type: UserManageOrganizationResponseDto,
      },
      { status: HttpStatus.CONFLICT, description: '既にコードが登録されている' },
    ],
  })
  async create(
    @User() user: UserEntity,
    @Body() creationDto: UserManageOrganizationCreationDto,
  ): Promise<UserManageOrganizationResponseDto> {
    const organization = await this.service.create(
      user,
      creationDto.code,
      creationDto.name,
      creationDto.nameKana,
    );
    return this.toResponse(organization);
  }

  @Get()
  @ApiPagination()
  @Swagger({
    operationId: 'getOrganizationsForUser',
    summary: '事業所の一覧を取得する',
    description: '事業所の一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: UserManageOrganizationResponseDto,
        isArray: true,
      },
    ],
  })
  async findAll(
    @User() user: UserEntity,
    @Pagination() pagination: PaginationDto,
  ): Promise<UserManageOrganizationResponseDto[]> {
    const users = await this.service.findAll(user, pagination);
    return users.map(this.toResponse);
  }

  @Get(':uuid')
  @Swagger({
    operationId: 'getOrganizationForUser',
    summary: '事業所を取得する',
    description: '事業所を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: UserManageOrganizationResponseDto,
      },
    ],
  })
  async findByUuid(
    @User() user: UserEntity,
    @Param('uuid') uuid: string,
  ): Promise<UserManageOrganizationResponseDto> {
    const organization = await this.service.findByUuid(user, uuid);
    return this.toResponse(organization);
  }

  @Delete(':uuid')
  @Swagger({
    operationId: 'removeOrganizationForUser',
    summary: '事業所を削除する',
    description: '事業所を削除する',
    responses: [
      {
        status: HttpStatus.NO_CONTENT,
      },
    ],
  })
  async remove(@User() user: UserEntity, @Param('uuid') uuid: string): Promise<void> {
    await this.service.remove(user, uuid);
  }

  toResponse(organization: OrganizationEntity): UserManageOrganizationResponseDto {
    return {
      uuid: organization.uuid,
      code: organization.code,
      name: organization.name,
      nameKana: organization.nameKana,
      state: organization.state,
    };
  }
}
