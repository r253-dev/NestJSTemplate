import { Test, TestingModule } from '@nestjs/testing';

import { AdminManageTenantService } from './admin-manage-tenant.service';
import { AdminManageTenantUsecase } from './admin-manage-tenant.usecase';
import { AdminManageTenantRepository } from './admin-manage-tenant.repository';
import { BcryptModule } from 'vendors/bcrypt/bcrypt.module';
import mockDate from '@libs/date';
import { TenantEntity } from './entities/tenant.entity';
import { TenantModel, State as TenantModelState } from 'share/models/tenant.model';

const tenant = TenantEntity.fromModel(
  new TenantModel({
    id: BigInt(1),
    code: 'tenant',
    uuid: 'daad09eb-ef5a-4d1e-8613-0a2fc93752ca',
    state: TenantModelState.ACTIVE,
    createdAt: new Date('2024-03-01T00:00:00+09:00'),
  }),
);

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
        expect(result).toBeInstanceOf(TenantEntity);
        expect(result.uuid).toEqual(expect.any(String));
        expect(result.code).toEqual('new-tenant');
      });
    });

    test('同じテナントコードでは登録できない', async () => {
      await expect(service.create('tenant')).rejects.toThrow(
        '指定されたコードは既に使用されています',
      );
    });
  });

  describe('テナントの削除', () => {
    // とりあえず正常終了することが確認できれば良しとする（削除されたかどうかはe2eで確認する）
    test('テナントを削除する', async () => {
      await expect(service.remove('daad09eb-ef5a-4d1e-8613-0a2fc93752ca')).resolves.not.toThrow();
    });
    test('存在しないUUIDを指定したらエラー', async () => {
      await expect(service.remove('not-found-uuid')).rejects.toThrow('Not Found');
    });
  });

  describe('テナント一覧の取得', () => {
    test('テナント一覧を取得する', async () => {
      const result = await service.findAll({ page: 1, perPage: 10 });
      expect(result).toHaveLength(10);
      expect(result[0]).toBeInstanceOf(TenantEntity);
      expect(result[0].uuid).toEqual('daad09eb-ef5a-4d1e-8613-0a2fc93752ca');
      expect(result[0].code).toEqual('tenant');
    });
  });

  describe('削除されたテナント一覧の取得', () => {
    test('削除されたテナント一覧を取得する', async () => {
      const result = await service.findAllRemoved({ page: 1, perPage: 10 });
      expect(result).toHaveLength(10);
      expect(result[0]).toBeInstanceOf(TenantEntity);
      expect(result[0].uuid).toEqual('daad09eb-ef5a-4d1e-8613-0a2fc93752ca');
      expect(result[0].code).toEqual('tenant');
    });
  });

  describe('UUIDからテナントの取得', () => {
    test('存在するUUIDであれば取得できる', async () => {
      const result = await service.findByUuid('daad09eb-ef5a-4d1e-8613-0a2fc93752ca');
      expect(result).toBeInstanceOf(TenantEntity);
      expect(result.uuid).toEqual('daad09eb-ef5a-4d1e-8613-0a2fc93752ca');
      expect(result.code).toEqual('tenant');
    });

    test('存在しないUUIDであればNot Found', async () => {
      await expect(service.findByUuid('not-found-uuid')).rejects.toThrow('Not Found');
    });
  });
});
