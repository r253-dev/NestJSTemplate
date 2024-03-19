import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';
import { getAdminToken } from '@libs/token';

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

describe('管理者の作成リクエスト (e2e)', () => {
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

describe('管理者の認証', () => {
  test('正しいemailとpasswordでログインできる', async () => {
    const response = await request(server).post('/v1/auth/admin').send({
      email: 'test@example.com',
      password: 'password',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      token: expect.stringContaining('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'),
    });
  });

  test('有効化前のユーザーにはログインできない', async () => {
    const response = await request(server).post('/v1/auth/admin').send({
      email: 'example@example.com',
      password: 'password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'メールアドレスまたはパスワードが間違っています',
      error: 'Unauthorized',
    });
  });

  test('emailが間違っていたらログインできない', async () => {
    const response = await request(server).post('/v1/auth/admin').send({
      email: 'invalid@example.com',
      password: 'password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'メールアドレスまたはパスワードが間違っています',
      error: 'Unauthorized',
    });
  });

  test('passwordが間違っていたらログインできない', async () => {
    const response = await request(server).post('/v1/auth/admin').send({
      email: 'test@example.com',
      password: 'invalid_password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'メールアドレスまたはパスワードが間違っています',
      error: 'Unauthorized',
    });
  });
});

describe('認証が必要なエンドポイントへのアクセス', () => {
  test('認証されていないとアクセスできない', async () => {
    const response = await request(server).get('/v1/admin/~');

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });

  test('tokenが正しければアクセスできる', async () => {
    const token = await getAdminToken(server, 'test@example.com', 'password');
    const response = await request(server)
      .get('/v1/admin/~')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      uuid: '3b30345f-8890-4559-9af7-e243662296ca',
      email: 'test@example.com',
      createdAt: '2023-12-31T15:00:00.000Z',
    });
  });
});
