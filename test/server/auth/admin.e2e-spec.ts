import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';

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

  test('INACTIVEな管理者はログインできない', async () => {
    const response = await request(server).post('/v1/auth/admin').send({
      email: 'inactive@example.com',
      password: 'password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'メールアドレスまたはパスワードが間違っています',
      error: 'Unauthorized',
    });
  });

  test('DISABLEDな管理者はログインできない', async () => {
    const response = await request(server).post('/v1/auth/admin').send({
      email: 'disabled@example.com',
      password: 'password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'メールアドレスまたはパスワードが間違っています',
      error: 'Unauthorized',
    });
  });

  test('REMOVEDな管理者はログインできない', async () => {
    const response = await request(server).post('/v1/auth/admin').send({
      email: 'removed@example.com',
      password: 'password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'メールアドレスまたはパスワードが間違っています',
      error: 'Unauthorized',
    });
  });

  test('パスワードが登録されていない管理者にはログインできない', async () => {
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
