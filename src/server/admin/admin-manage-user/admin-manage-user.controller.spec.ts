import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminManageUserController } from './admin-manage-user.controller';
import { AdminManageUserService } from './admin-manage-user.service';
import { TenantModel, State as TenantModelState } from 'share/models/tenant.model';
import { TenantEntity } from './entities/tenant.entity';
import { UserEntity } from './entities/user.entity';
import { UserModel, State } from 'share/models/user.model';
import { NotFoundException } from '@nestjs/common';

const tenant = TenantEntity.fromModel(
  new TenantModel({
    id: BigInt(1),
    code: 'tenant',
    uuid: 'daad09eb-ef5a-4d1e-8613-0a2fc93752ca',
    state: TenantModelState.ACTIVE,
    createdAt: new Date('2024-03-01T00:00:00+09:00'),
  }),
);

const user = UserEntity.fromModel(
  new UserModel({
    id: BigInt(1),
    tenantId: tenant.id,
    uuid: '93cfd7c7-84a5-4f52-ac4c-f9177924d20c',
    code: 'alice',
    passwordHash: '$2b$10$h16Y3k2LriL40/8TLjdyX.cXbSJm3FggySYpDvaUmTnaw8oGvgsZS',
    state: State.ACTIVE,
    name: 'Alice Doe',
    displayName: 'Alice',
    email: 'alice@example.com',
    createdAt: new Date('2024-03-01T00:00:00+09:00'),
  }),
);

class AdminManageUserServiceMock {
  async create() {
    return user;
  }
  async findAll(_tenantUuid: string, pagination: any) {
    return new Array(pagination.perPage).fill(user);
  }
  async findAllRemoved() {
    return [user];
  }
  async findByUuid(_tenantUuid: string, uuid: string) {
    if (uuid === user.uuid) {
      return user;
    }
    throw new NotFoundException();
  }
  async remove() {}

  toResponse(user: any) {
    return {
      uuid: user.uuid,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

describe('AdminManageUserController', () => {
  let server: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminManageUserController],
      providers: [
        {
          provide: AdminManageUserService,
          useClass: AdminManageUserServiceMock,
        },
      ],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /admin/~/tenants/:id/users', () => {
    test('正常系', async () => {
      const response = await request(server).post(`/admin/~/tenants/${tenant.uuid}/users`).send({
        code: 'test',
        password: 'password',
        name: 'test-user',
        displayName: 'Test User',
      });
      expect(response.status).toEqual(201);
    });

    test('emailも指定できる', async () => {
      const response = await request(server).post(`/admin/~/tenants/${tenant.uuid}/users`).send({
        code: 'test',
        password: 'password',
        name: 'test-user',
        displayName: 'Test User',
        email: 'test@example.com',
      });
      expect(response.status).toEqual(201);
    });

    test('email形式でなければNG', async () => {
      const response = await request(server).post(`/admin/~/tenants/${tenant.uuid}/users`).send({
        code: 'test',
        password: 'password',
        name: 'test-user',
        displayName: 'Test User',
        email: 'invalid-email',
      });
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_string',
            message: 'Invalid email',
            path: ['email'],
            validation: 'email',
          },
        ],
      });
    });

    test('passwordは8文字必須', async () => {
      const response = await request(server).post(`/admin/~/tenants/${tenant.uuid}/users`).send({
        code: 'test',
        password: '1234567',
        name: 'test-user',
        displayName: 'Test User',
        email: 'test@example.com',
      });
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed',
        errors: [
          {
            code: 'too_small',
            message: 'パスワードは8文字以上の長さが必要です',
            path: ['password'],
            type: 'string',
            minimum: 8,
            inclusive: true,
            exact: false,
          },
        ],
      });
    });

    test('body指定が無いとNG', async () => {
      const response = await request(server).post(`/admin/~/tenants/${tenant.uuid}/users`);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['code'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['password'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['name'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['displayName'],
            expected: 'string',
            received: 'undefined',
          },
        ],
      });
    });
  });

  describe('GET /admin/~/tenants/:id/users', () => {
    test('paginationが有効（デフォルト25件/1ページ）', async () => {
      const response = await request(server).get(`/admin/~/tenants/${tenant.uuid}/users`);
      expect(response.status).toEqual(200);
      expect(response.body[0]).toEqual({
        uuid: '93cfd7c7-84a5-4f52-ac4c-f9177924d20c',
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
        createdAt: '2024-02-29T15:00:00.000Z',
      });
      expect(response.body.length).toEqual(25);
    });
  });

  describe('GET /admin/~/tenants/:id/users/@removed', () => {
    test('paginationが有効', async () => {
      const response = await request(server).get(`/admin/~/tenants/${tenant.uuid}/users`).query({
        perPage: '50',
        page: '2',
      });
      expect(response.status).toEqual(200);
      expect(response.body[0]).toEqual({
        uuid: '93cfd7c7-84a5-4f52-ac4c-f9177924d20c',
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
        createdAt: '2024-02-29T15:00:00.000Z',
      });
      expect(response.body.length).toEqual(50);
    });
  });
});
