import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'share/dto/pagination.dto';
import { UserManageUserRepository, Condition } from './user-manage-user.repository';
import { TenantEntity } from './entities/tenant.entity';
import { UserEntity } from './entities/user.entity';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';

type CreationParams = {
  code: string;
  password: string;
  name: string;
  displayName: string;
  email: string | null;
};

@Injectable()
export class UserManageUserUsecase {
  constructor(
    private repository: UserManageUserRepository,
    private bcrypt: BcryptService,
  ) {}

  async create(authorizedUser: UserEntity, params: CreationParams): Promise<UserEntity> {
    if (await this.existsByCode(authorizedUser.tenant, params.code)) {
      throw new ConflictException('指定されたコードは既に使用されています');
    }
    if (await this.existsByEmail(authorizedUser.tenant, params.email)) {
      throw new ConflictException('指定されたメールアドレスは既に使用されています');
    }
    const { password, ...rest } = params;
    const passwordHash = await this.bcrypt.hash(password, 10);
    const user = UserEntity.factory(authorizedUser.tenant, { ...rest, passwordHash });
    await this.repository.save(user);
    return user;
  }

  async findAll(
    tenant: TenantEntity,
    pagination: PaginationDto,
    condition?: Condition,
  ): Promise<UserEntity[]> {
    return await this.repository.findAll(tenant, pagination, condition);
  }

  async find(tenant: TenantEntity, condition?: Condition): Promise<UserEntity> {
    const organization = await this.repository.find(tenant, condition);
    if (organization === null) {
      throw new NotFoundException('指定された事業所は存在しません');
    }
    return organization;
  }

  private async existsByCode(tenant: TenantEntity, code: string): Promise<boolean> {
    if (code === null) {
      return false;
    }
    const user = await this.repository.find(tenant, { code });
    return user !== null;
  }

  private async existsByEmail(tenant: TenantEntity, email: string | null): Promise<boolean> {
    if (email === null) {
      return false;
    }
    const user = await this.repository.find(tenant, { email });
    return user !== null;
  }
}
