import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';
import { PaginationDto } from 'share/dto/pagination.dto';
import { AdminManageUserRepository, Condition } from './admin-manage-user.repository';
import { TenantEntity } from './entities/tenant.entity';

type UserCreationParams = {
  code: string;
  password: string;
  email: string | null;
  name: string;
  displayName: string;
};

@Injectable()
export class AdminManageUserUsecase {
  constructor(
    private repository: AdminManageUserRepository,
    private bcrypt: BcryptService,
  ) {}

  async create(tenant: TenantEntity, params: UserCreationParams): Promise<UserEntity> {
    if (await this.existsByCode(tenant, params.code)) {
      throw new ConflictException('指定されたコードは既に使用されています');
    }
    if (await this.existsByEmail(params.email)) {
      throw new ConflictException('指定されたメールアドレスは既に使用されています');
    }
    const { password, ...rest } = params;
    const passwordHash = await this.bcrypt.hash(password, 10);
    const user = UserEntity.factory(tenant, { ...rest, passwordHash });
    await this.repository.save(user);
    return user;
  }

  async remove(tenant: TenantEntity, user: UserEntity): Promise<void> {
    user.remove();
    await this.repository.save(user);
  }

  async findAll(
    tenant: TenantEntity,
    pagination: PaginationDto,
    condition?: Condition,
  ): Promise<UserEntity[]> {
    return await this.repository.findAll(tenant, pagination, condition);
  }

  async find(tenant: TenantEntity, condition?: Condition): Promise<UserEntity> {
    const user = await this.repository.find(tenant, condition);
    if (user === null) {
      throw new NotFoundException('指定されたユーザーは存在しません');
    }
    return user;
  }

  async existsByEmail(email: string | null): Promise<boolean> {
    if (email === null) {
      return false;
    }
    return await this.repository.existsByEmail(email);
  }

  async existsByCode(tenant: TenantEntity, code: string): Promise<boolean> {
    try {
      await this.findByCode(tenant, code);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async findByCode(tenant: TenantEntity, code: string): Promise<UserEntity> {
    const user = await this.repository.find(tenant, { code });
    if (user === null) {
      throw new NotFoundException('指定されたコードのユーザーは存在しません');
    }
    return user;
  }
}
