import { Controller, UsePipes, HttpStatus, Get, Param, Post, Body } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { UserManageUserService } from './user-manage-user.service';

import { Swagger } from 'share/decorators/swagger';
import { UserManageUserResponseDto } from './dto/user-manage-user-response.dto';
import { UserManageUserCreationDto } from './dto/user-manage-user-creation-dto';
import { ApiPagination, Pagination } from 'share/decorators/pagination.decorator';
import { PaginationDto } from 'share/dto/pagination.dto';
import { User } from 'share/decorators/user';
import { UserEntity as AuthorizedUser } from 'auth/user-auth/entities/user.entity';
import { UserEntity } from './entities/user.entity';

@Controller('users/~/users')
@ApiTags('user', 'ユーザーのユーザー管理モジュール')
@UsePipes(ZodValidationPipe)
export class UserManageUserController {
  constructor(private readonly service: UserManageUserService) {}

  @Post()
  @Swagger({
    operationId: 'createUserForUser',
    summary: 'ユーザーがテナントにユーザーを登録する',
    description: 'ユーザーがテナントにユーザーを登録する',
    body: { type: UserManageUserCreationDto },
    responses: [
      {
        status: HttpStatus.CREATED,
        type: UserManageUserResponseDto,
      },
      { status: HttpStatus.CONFLICT, description: '既にコードが登録されている' },
      { status: HttpStatus.CONFLICT, description: '既にメールアドレスが登録されている' },
    ],
  })
  async create(
    @User() authorizedUser: AuthorizedUser,
    @Body() creationDto: UserManageUserCreationDto,
  ): Promise<UserManageUserResponseDto> {
    const user = await this.service.create(authorizedUser, {
      code: creationDto.code,
      password: creationDto.password,
      name: creationDto.name,
      displayName: creationDto.displayName,
      email: creationDto.email,
    });
    return this.toResponse(user);
  }

  @Get()
  @ApiPagination()
  @Swagger({
    operationId: 'getUsersForUser',
    summary: 'ユーザーがテナント内のユーザーの一覧を取得する',
    description: 'ユーザーがテナント内のユーザーの一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: UserManageUserResponseDto,
        isArray: true,
      },
    ],
  })
  async findAll(
    @User() authorizedUser: AuthorizedUser,
    @Pagination() pagination: PaginationDto,
  ): Promise<UserManageUserResponseDto[]> {
    const users = await this.service.findAll(authorizedUser, pagination);
    return users.map(this.toResponse);
  }

  @Get(':uuid')
  @Swagger({
    operationId: 'getUserForUser',
    summary: 'テナント内のユーザーを取得する',
    description: 'テナント内のユーザーを取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: UserManageUserResponseDto,
      },
    ],
  })
  async findByUuid(
    @User() authorizedUser: AuthorizedUser,
    @Param('uuid') uuid: string,
  ): Promise<UserManageUserResponseDto> {
    const user = await this.service.findByUuid(authorizedUser, uuid);
    return this.toResponse(user);
  }

  toResponse(user: UserEntity): UserManageUserResponseDto {
    return {
      uuid: user.uuid,
      state: user.state,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
    };
  }
}
