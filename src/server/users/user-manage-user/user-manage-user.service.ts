import { Injectable } from '@nestjs/common';
import { UserManageUserUsecase } from './user-manage-user.usecase';
import { UserEntity } from './entities/user.entity';
import { PaginationDto } from 'share/dto/pagination.dto';

type CreationParams = {
  code: string;
  password: string;
  name: string;
  displayName: string;
  email: string | null;
};

@Injectable()
export class UserManageUserService {
  constructor(private usecase: UserManageUserUsecase) {}

  async create(authorizedUser: UserEntity, params: CreationParams): Promise<UserEntity> {
    return await this.usecase.create(authorizedUser, params);
  }

  async findAll(user: UserEntity, pagination: PaginationDto): Promise<UserEntity[]> {
    return await this.usecase.findAll(user.tenant, pagination);
  }

  async findByUuid(user: UserEntity, uuid: string): Promise<UserEntity> {
    return await this.usecase.find(user.tenant, { uuid });
  }
}
