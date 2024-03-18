import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';

describe('管理者の作成リクエスト (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    server = app.getHttpServer();
  });
  afterAll(() => {
    app.close();
  });

  describe('管理者の作成リクエスト', () => {
    test('許可されたメールアドレスであればリクエストできる', async () => {
      const response = await request(server).post('/v1/administrators').send({
        email: 'r253.hmdryou@gmail.com',
      });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        status: 'success',
      });
    });

    test('許可されたドメインであればリクエストできる', async () => {
      const response = await request(server).post('/v1/administrators').send({
        email: 'example@example.com',
      });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        status: 'success',
      });
    });

    test('既に登録されているユーザーであってもリクエストは通る（セキュリティ上のヒントを与えないため）', async () => {
      // TODO: test@example.comでログインできることを確認するテストの追加
      const response = await request(server).post('/v1/administrators').send({
        email: 'test@example.com',
      });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        status: 'success',
      });
    });

    test('許可されていないメールアドレスではリクエストできない', async () => {
      const response = await request(server).post('/v1/administrators').send({
        email: 'evil@gmail.com',
      });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        status: 'failed',
      });
    });

    test('email指定がなければパラメーターエラー', async () => {
      const response = await request(server).post('/v1/administrators');

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
