import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminManageTenantController } from './admin-manage-tenant.controller';
import { AdminManageTenantService } from './admin-manage-tenant.service';

class ServiceMock {
  async create() {}
  async findAll(props: any) {
    return props;
  }
  async findAllRemoved(props: any) {
    return props;
  }
  async findByUuid(uuid: string) {
    return uuid;
  }
  async remove() {}
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
        code: 'password',
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
      const response = await request(server).get('/admin/~/tenants/uuid-like-string');
      expect(response.status).toEqual(200);
      expect(response.text).toEqual('uuid-like-string');
    });
  });

  describe('DELETE /admin/~/tenants/:uuid', () => {
    test('UUIDがしっかりと受け取られている', async () => {
      const response = await request(server).delete('/admin/~/tenants/uuid-like-string');
      expect(response.status).toEqual(204);
    });
  });
});
