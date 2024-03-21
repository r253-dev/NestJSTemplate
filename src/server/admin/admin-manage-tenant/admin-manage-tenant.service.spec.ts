import { Test, TestingModule } from '@nestjs/testing';

import { AdminManageTenantService } from './admin-manage-tenant.service';
import { AdminManageTenantUsecase } from './admin-manage-tenant.usecase';
import { AdminManageTenantRepository } from './admin-manage-tenant.repository';
import { BcryptModule } from 'vendors/bcrypt/bcrypt.module';
import mockDate from '@libs/date';
import { TenantEntity } from './entities/tenant.entity';
import { State, TenantModel } from 'share/models/tenant.model';

const tenantModel = new TenantModel({
  id: BigInt(1),
  uuid: 'b323b661-fbf9-4309-b5ce-6b6210019b95',
  code: 'test',
  state: State.ACTIVE,
  createdAt: new Date('2024-03-01T00:00:00+09:00'),
});
const tenant = TenantEntity.fromModel(tenantModel);

class AdminManageTenantRepositoryMock {
  async findByCode(code: string) {
    if (code === tenant.code) {
      return tenant;
    }
    return null;
  }

  async findByUuid(uuid: string) {
    if (uuid === tenant.uuid) {
      return tenant;
    }
    return null;
  }

  async findAll(pagination: any) {
    return new Array(pagination.perPage).fill(tenant);
  }

  async save() {}
}

describe('AdministratorsService', () => {
  let service: AdminManageTenantService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminManageTenantService,
        AdminManageTenantUsecase,
        {
          provide: AdminManageTenantRepository,
          useClass: AdminManageTenantRepositoryMock,
        },
      ],
      imports: [BcryptModule],
    }).compile();

    service = module.get(AdminManageTenantService);
  });

  describe('テナントを作成', () => {
    test('テナントが作成され、UUIDが付与される', async () => {
      await mockDate('2024-03-01T12:34:56.789Z', async () => {
        const result = await service.create('new-tenant');
        expect(result).toEqual({
          uuid: expect.any(String),
          code: 'new-tenant',
        });
      });
    });

    test('同じテナントコードでは登録できない', async () => {
      await expect(service.create('test')).rejects.toThrow('Conflict');
    });
  });

  describe('テナントの削除', () => {
    // とりあえず正常終了することが確認できれば良しとする（削除されたかどうかはe2eで確認する）
    test('テナントを削除する', async () => {
      await expect(service.remove('b323b661-fbf9-4309-b5ce-6b6210019b95')).resolves.not.toThrow();
    });
    test('存在しないUUIDを指定したらエラー', async () => {
      await expect(service.remove('not-found-uuid')).rejects.toThrow('Not Found');
    });
  });

  describe('テナント一覧の取得', () => {
    test('テナント一覧を取得する', async () => {
      const result = await service.findAll({ page: 1, perPage: 10 });
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({
        uuid: 'b323b661-fbf9-4309-b5ce-6b6210019b95',
        code: 'test',
      });
      expect(result[1]).toEqual({
        uuid: 'b323b661-fbf9-4309-b5ce-6b6210019b95',
        code: 'test',
      });
    });
  });

  describe('削除されたテナント一覧の取得', () => {
    test('削除されたテナント一覧を取得する', async () => {
      const result = await service.findAllRemoved({ page: 1, perPage: 10 });
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({
        uuid: 'b323b661-fbf9-4309-b5ce-6b6210019b95',
        code: 'test',
      });
    });
  });

  describe('UUIDからテナントの取得', () => {
    test('存在するUUIDであれば取得できる', async () => {
      const result = await service.findByUuid('b323b661-fbf9-4309-b5ce-6b6210019b95');
      expect(result).toEqual({
        uuid: 'b323b661-fbf9-4309-b5ce-6b6210019b95',
        code: 'test',
      });
    });

    test('存在しないUUIDであればNot Found', async () => {
      await expect(service.findByUuid('not-found-uuid')).rejects.toThrow('Not Found');
    });
  });
});
