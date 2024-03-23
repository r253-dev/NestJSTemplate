import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminManageTenantController } from './admin-manage-tenant.controller';
import { AdminManageTenantService } from './admin-manage-tenant.service';
import { TenantEntity } from './entities/tenant.entity';
import { TenantModel, State as TenantModelState } from 'share/models/tenant.model';
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

class ServiceMock {
  async create() {
    return tenant;
  }
  async findAll() {
    return [tenant];
  }
  async findAllRemoved() {
    return [tenant];
  }
  async findByUuid(uuid: string) {
    if (uuid === tenant.uuid) {
      return tenant;
    }
    throw new NotFoundException();
  }
  async remove(uuid: string) {
    if (uuid === tenant.uuid) {
      return tenant;
    }
    throw new NotFoundException();
  }
}

describe('AdminManageTenantController', () => {
  let server: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminManageTenantController],
      providers: [
        {
          provide: AdminManageTenantService,
          useClass: ServiceMock,
        },
      ],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /admin/~/tenants', () => {
    test('codeが必要', async () => {
      const response = await request(server).post('/admin/~/tenants').send({
        code: 'tenant-code',
      });
      expect(response.status).toEqual(201);
    });

    test('codeは32文字まで', async () => {
      // 32文字なら問題ない
      {
        const response = await request(server).post('/admin/~/tenants').send({
          code: '12345678901234567890123456789012',
        });
        expect(response.status).toEqual(201);
      }
      // 33文字はアウト
      {
        const response = await request(server).post('/admin/~/tenants').send({
          code: '123456789012345678901234567890123',
        });
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'Validation failed',
          errors: [
            {
              code: 'too_big',
              message: 'String must contain at most 32 character(s)',
              path: ['code'],
              type: 'string',
              maximum: 32,
              exact: false,
              inclusive: true,
            },
          ],
        });
      }
    });

    test('body指定が無いとNG', async () => {
      const response = await request(server).post('/admin/~/tenants');
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
        ],
      });
    });
  });

  describe('GET /admin/~/tenants/:uuid', () => {
    test('UUIDがしっかりと受け取られている', async () => {
      // 存在するUUIDを指定したらリクエストが通り
      {
        const response = await request(server).get(`/admin/~/tenants/${tenant.uuid}`);
        expect(response.status).toEqual(200);
      }
      // 存在しないUUIDを指定したらリクエストが弾かれる
      {
        const response = await request(server).get(
          `/admin/~/tenants/4b811d63-9aef-462b-ae30-01e1ad547473`,
        );
        expect(response.status).toEqual(404);
      }
    });
  });

  describe('DELETE /admin/~/tenants/:uuid', () => {
    test('UUIDがしっかりと受け取られている', async () => {
      // 存在するUUIDを指定したらリクエストが通り
      {
        const response = await request(server).delete(`/admin/~/tenants/${tenant.uuid}`);
        expect(response.status).toEqual(204);
      }
      // 存在しないUUIDを指定したらリクエストが弾かれる
      {
        const response = await request(server).delete(
          `/admin/~/tenants/4b811d63-9aef-462b-ae30-01e1ad547473`,
        );
        expect(response.status).toEqual(404);
      }
    });
  });
});
