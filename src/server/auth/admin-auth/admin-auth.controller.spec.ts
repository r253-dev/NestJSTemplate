import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

class ServiceMock {
  async login(): Promise<{ token: string }> {
    return { token: 'dummy' };
  }
}

let server: any;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [AdminAuthController],
    providers: [
      {
        provide: AdminAuthService,
        useClass: ServiceMock,
      },
    ],
  }).compile();
  const app = module.createNestApplication();
  await app.init();
  server = app.getHttpServer();
});

describe('AdminAuthController', () => {
  describe('POST /auth/admin', () => {
    test('emailとpasswordが必要', async () => {
      const response = await request(server).post('/auth/admin').send({
        email: 'test@example.com',
        password: 'password',
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ token: 'dummy' });
    });

    test('email形式でなければNG', async () => {
      const response = await request(server).post('/auth/admin').send({
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

    test('email/password指定が無いとNG', async () => {
      const response = await request(server).post('/auth/admin');
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
});
