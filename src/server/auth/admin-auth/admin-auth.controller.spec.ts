import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminLocalStrategy } from './admin-local.strategy';

class ServiceMock {
  async issueToken(): Promise<{ token: string }> {
    return { token: 'dummy' };
  }
}

class LocalStrategyMock extends PassportStrategy(Strategy) {
  constructor() {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    if (email === 'test@example.com' && password === 'password') {
      return { uuid: '690f5dc4-449f-4499-b471-a57768ee7b8d' };
    }
    throw new UnauthorizedException();
  }
}

let server: any;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [AdminAuthController],
    providers: [
      {
        provide: AdminLocalStrategy,
        useClass: LocalStrategyMock,
      },
      {
        provide: AdminAuthService,
        useClass: ServiceMock,
      },
    ],
    imports: [PassportModule],
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
