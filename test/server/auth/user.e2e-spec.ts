import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';
import { getAdminToken } from '@libs/token';
import { Tenant, createTenant } from '@libs/tenant';
import mockDate from '@libs/date';

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

describe('ユーザー認証 (e2e)', () => {
  let tenant: Tenant = {
    uuid: '',
    code: '',
  };
  let adminToken = '';
  let loginUuid = '';
  let userToken = '';
  test('テナント作成', async () => {
    adminToken = await getAdminToken(server, 'test@example.com', 'password');
    tenant = await createTenant(server, adminToken);
  });

  test('ユーザーの作成', async () => {
    await mockDate('2024-01-02T00:00:00.000Z', async () => {
      const response = await request(server)
        .post(`/v1/admin/~/tenants/${tenant.uuid}/users`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'login',
          password: 'password',
        });

      expect(response.status).toEqual(201);
      loginUuid = response.body.uuid;
    });
  });

  test('ログイン', async () => {
    const response = await request(server).post(`/v1/auth/user`).send({
      tenantCode: tenant.code,
      code: 'login',
      password: 'password',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    userToken = response.body.token;
  });

  test('プロファイルの取得', async () => {
    const response = await request(server)
      .get(`/v1/users/~`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      uuid: loginUuid,
      email: null,
      createdAt: '2024-01-02T00:00:00.000Z',
    });
  });

  test('ログインに必要なパラメーターが無いとログインできない', async () => {
    const response = await request(server).post(`/v1/auth/user`);

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
        {
          code: 'invalid_type',
          message: 'Required',
          path: ['password'],
          expected: 'string',
          received: 'undefined',
        },
        {
          code: 'invalid_type',
          message: 'Required',
          path: ['tenantCode'],
          expected: 'string',
          received: 'undefined',
        },
      ],
    });
  });

  test('tenantCodeが無いとログインできない', async () => {
    const response = await request(server).post(`/v1/auth/user`).send({
      code: 'login',
      password: 'password',
    });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        {
          code: 'invalid_type',
          message: 'Required',
          path: ['tenantCode'],
          expected: 'string',
          received: 'undefined',
        },
      ],
    });
  });

  test('テナントコードが違うとログインできない', async () => {
    const response = await request(server).post(`/v1/auth/user`).send({
      tenantCode: 'evil-tenant-code',
      code: 'login',
      password: 'password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'ログインIDまたはパスワードが間違っています',
    });
  });

  test('ログインIDをが違うとログインできない', async () => {
    const response = await request(server).post(`/v1/auth/user`).send({
      tenantCode: tenant.code,
      code: 'evil-user',
      password: 'password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'ログインIDまたはパスワードが間違っています',
    });
  });

  test('パスワードが違うとログインできない', async () => {
    const response = await request(server).post(`/v1/auth/user`).send({
      tenantCode: tenant.code,
      code: 'login',
      password: 'evil-password',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'ログインIDまたはパスワードが間違っています',
    });
  });

  test('認証なしではプロファイルを取得できない', async () => {
    const response = await request(server).get(`/v1/users/~`);

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });

  test('もちろん管理者プロファイルは取得できない', async () => {
    const response = await request(server)
      .get(`/v1/admin/~`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toEqual(403);
    expect(response.body).toEqual({
      statusCode: 403,
      message: 'Forbidden',
    });
  });
});
