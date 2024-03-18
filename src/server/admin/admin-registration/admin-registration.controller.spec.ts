import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminRegistrationController } from './admin-registration.controller';
import { AdminRegistrationService } from './admin-registration.service';

class ServiceMock {
  async register(dto: { email: string }) {
    return dto.email;
  }
}

describe('AdminRegistrationController', () => {
  let server: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminRegistrationController],
      providers: [
        {
          provide: AdminRegistrationService,
          useClass: ServiceMock,
        },
      ],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /administrators', () => {
    test('email形式であればOK', async () => {
      const response = await request(server).post('/administrators').send({
        email: 'test@example.com',
      });
      expect(response.status).toEqual(201);
      expect(response.text).toEqual('test@example.com');
    });

    test('email形式でなければNG', async () => {
      const response = await request(server).post('/administrators').send({
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

    test('email指定が無いとNG', async () => {
      const response = await request(server).post('/administrators');
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
        ],
      });
    });
  });
});
