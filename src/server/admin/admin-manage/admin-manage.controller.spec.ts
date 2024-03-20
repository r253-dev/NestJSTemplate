import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminManageController } from './admin-manage.controller';
import { AdminManageService } from './admin-manage.service';

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

describe('AdminManageController', () => {
  let server: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminManageController],
      providers: [
        {
          provide: AdminManageService,
          useClass: ServiceMock,
        },
      ],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /admin/~/administrators', () => {
    test('emailとpasswordが必要', async () => {
      const response = await request(server).post('/admin/~/administrators').send({
        email: 'test@example.com',
        password: 'password',
      });
      expect(response.status).toEqual(201);
    });

    test('email形式でなければNG', async () => {
      const response = await request(server).post('/admin/~/administrators').send({
        email: 'invalid-email',
        password: 'password',
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
      const response = await request(server).post('/admin/~/administrators').send({
        email: 'test@example.com',
        password: '1234567',
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
      const response = await request(server).post('/admin/~/administrators');
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['email'],
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
        ],
      });
    });
  });

  describe('GET /admin/~/administrators', () => {
    test('paginationが有効（デフォルト25件/1ページ）', async () => {
      const response = await request(server).get('/admin/~/administrators');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        perPage: 25,
        page: 1,
      });
    });
  });

  describe('GET /admin/~/administrators/@removed', () => {
    test('paginationが有効', async () => {
      const response = await request(server).get('/admin/~/administrators/@removed').query({
        perPage: '50',
        page: '2',
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        perPage: 50,
        page: 2,
      });
    });

    test('perPageは最大100', async () => {
      {
        const response = await request(server).get('/admin/~/administrators/@removed').query({
          perPage: '100',
          page: '1',
        });
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          perPage: 100,
          page: 1,
        });
      }
      {
        const response = await request(server).get('/admin/~/administrators/@removed').query({
          perPage: '101',
          page: '1',
        });
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'Validation failed',
          errors: [
            {
              code: 'too_big',
              message: 'Number must be less than or equal to 100',
              path: ['perPage'],
              type: 'number',
              maximum: 100,
              inclusive: true,
              exact: false,
            },
          ],
        });
      }
    });
  });

  describe('GET /admin/~/administrators/:uuid', () => {
    test('UUIDがしっかりと受け取られている', async () => {
      const response = await request(server).get('/admin/~/administrators/uuid-like-string');
      expect(response.status).toEqual(200);
      expect(response.text).toEqual('uuid-like-string');
    });
  });

  describe('DELETE /admin/~/administrators/:uuid', () => {
    test('UUIDがしっかりと受け取られている', async () => {
      const response = await request(server).delete('/admin/~/administrators/uuid-like-string');
      expect(response.status).toEqual(204);
    });
  });
});
