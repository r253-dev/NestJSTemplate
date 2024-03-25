import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminManageController } from './admin-manage.controller';
import { AdminManageService } from './admin-manage.service';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdministratorModel, State } from 'share/models/administrator.model';
import { NotFoundException } from '@nestjs/common';

const administratorModel = new AdministratorModel({
  id: BigInt(1),
  uuid: '9c1b2f59-7273-4a44-b901-fbbd11884b71',
  email: 'test@example.com',
  passwordHash: '$2b$10$h16Y3k2LriL40/8TLjdyX.cXbSJm3FggySYpDvaUmTnaw8oGvgsZS',
  state: State.ACTIVE,
  createdAt: new Date('2024-03-01T00:00:00+09:00'),
});
const administrator = AdministratorEntity.fromModel(administratorModel);

class ServiceMock {
  async create() {
    return administrator;
  }
  async findAll() {
    return [administrator];
  }
  async findAllRemoved() {
    return [administrator];
  }
  async findByUuid(uuid: string) {
    if (uuid === administrator.uuid) {
      return administrator;
    }
    throw new NotFoundException();
  }
  async remove(uuid: string) {
    if (uuid === administrator.uuid) {
      return;
    }
    throw new NotFoundException();
  }
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
      expect(response.body).toEqual({
        uuid: administrator.uuid,
        email: administrator.email,
        createdAt: administrator.createdAt.toISOString(),
      });
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
    test('全件取得', async () => {
      const response = await request(server).get('/admin/~/administrators');
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        uuid: administrator.uuid,
        email: administrator.email,
        createdAt: administrator.createdAt.toISOString(),
      });
    });
  });

  describe('GET /admin/~/administrators/:uuid', () => {
    test('UUIDがしっかりと受け取られている', async () => {
      const response = await request(server).get(`/admin/~/administrators/${administrator.uuid}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        uuid: administrator.uuid,
        email: administrator.email,
        createdAt: administrator.createdAt.toISOString(),
      });
    });
  });

  describe('DELETE /admin/~/administrators/:uuid', () => {
    test('UUIDがしっかりと受け取られている', async () => {
      // 存在するUUIDを指定したらリクエストが通り
      {
        const response = await request(server).delete(
          `/admin/~/administrators/${administrator.uuid}`,
        );
        expect(response.status).toEqual(204);
      }
      // 存在しないUUIDを指定したらリクエストが弾かれる
      {
        const response = await request(server).delete(
          `/admin/~/administrators/4b811d63-9aef-462b-ae30-01e1ad547473`,
        );
        expect(response.status).toEqual(404);
      }
    });
  });
});
