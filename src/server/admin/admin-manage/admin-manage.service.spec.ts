import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorModel, State } from 'share/models/administrator.model';

import { AdminManageService } from './admin-manage.service';
import { AdminManageUsecase } from './admin-manage.usecase';
import { AdminManageRepository } from './admin-manage.repository';
import { BcryptModule } from 'vendors/bcrypt/bcrypt.module';
import mockDate from '@libs/date';
import { AdministratorEntity } from './entities/administrator.entity';

const administratorModel = new AdministratorModel({
  id: BigInt(1),
  uuid: '9c1b2f59-7273-4a44-b901-fbbd11884b71',
  email: 'test@example.com',
  passwordHash: '$2b$10$h16Y3k2LriL40/8TLjdyX.cXbSJm3FggySYpDvaUmTnaw8oGvgsZS',
  state: State.ACTIVE,
  createdAt: new Date('2024-03-01T00:00:00+09:00'),
});
const administrator = AdministratorEntity.fromModel(administratorModel);

class AdminManageRepositoryMock {
  async findByEmail(email: string) {
    if (email === administrator.email) {
      return administrator;
    }
    return null;
  }

  async findByUuid(uuid: string) {
    if (uuid === administrator.uuid) {
      return administrator;
    }
    return null;
  }

  async findAll(pagination: any) {
    return new Array(pagination.perPage).fill(administrator);
  }

  async save() {}
}

describe('AdministratorsService', () => {
  let service: AdminManageService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminManageService,
        AdminManageUsecase,
        {
          provide: AdminManageRepository,
          useClass: AdminManageRepositoryMock,
        },
      ],
      imports: [BcryptModule],
    }).compile();

    service = module.get(AdminManageService);
  });

  describe('管理者を作成', () => {
    test('管理者を作成され、UUIDが付与される', async () => {
      await mockDate('2024-03-01T12:34:56.789Z', async () => {
        const result = await service.create('test@test.example.com', 'password');
        expect(result).toEqual({
          uuid: expect.any(String),
          email: 'test@test.example.com',
          createdAt: new Date('2024-03-01T12:34:56.789Z'),
        });
      });
    });

    test('同じメアドでは登録できない', async () => {
      await expect(service.create('test@example.com', 'password')).rejects.toThrow('Conflict');
    });
  });

  describe('管理者の削除', () => {
    // とりあえず正常終了することが確認できれば良しとする（削除されたかどうかはe2eで確認する）
    test('管理者を削除する', async () => {
      await expect(service.remove('9c1b2f59-7273-4a44-b901-fbbd11884b71')).resolves.not.toThrow();
    });
    test('存在しないUUIDを指定したらエラー', async () => {
      await expect(service.remove('not-found-uuid')).rejects.toThrow('Not Found');
    });
  });

  describe('管理者一覧の取得', () => {
    test('管理者一覧を取得する', async () => {
      const result = await service.findAll({ page: 1, perPage: 10 });
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({
        uuid: '9c1b2f59-7273-4a44-b901-fbbd11884b71',
        email: 'test@example.com',
        createdAt: new Date('2024-02-29T15:00:00.000Z'),
      });
      expect(result[1]).toEqual({
        uuid: '9c1b2f59-7273-4a44-b901-fbbd11884b71',
        email: 'test@example.com',
        createdAt: new Date('2024-02-29T15:00:00.000Z'),
      });
    });
  });

  describe('削除された管理者一覧の取得', () => {
    test('削除された管理者一覧を取得する', async () => {
      const result = await service.findAllRemoved({ page: 1, perPage: 10 });
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({
        uuid: '9c1b2f59-7273-4a44-b901-fbbd11884b71',
        email: 'test@example.com',
        createdAt: new Date('2024-02-29T15:00:00.000Z'),
      });
    });
  });

  describe('UUIDから管理者の取得', () => {
    test('存在するUUIDであれば取得できる', async () => {
      const result = await service.findByUuid('9c1b2f59-7273-4a44-b901-fbbd11884b71');
      expect(result).toEqual({
        uuid: '9c1b2f59-7273-4a44-b901-fbbd11884b71',
        email: 'test@example.com',
        createdAt: new Date('2024-02-29T15:00:00.000Z'),
      });
    });

    test('存在しないUUIDであればNot Found', async () => {
      await expect(service.findByUuid('not-found-uuid')).rejects.toThrow('Not Found');
    });
  });
});
