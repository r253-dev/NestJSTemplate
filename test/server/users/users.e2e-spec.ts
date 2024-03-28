import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';
import { getAdminToken, getUserToken } from '@libs/token';
import { Tenant, createTenant } from '@libs/tenant';
import { registerUser } from '@libs/register';

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

describe('ユーザーによるユーザーの管理', () => {
  let tenant: Tenant = {
    uuid: '',
    code: '',
  };
  let adminToken = '';
  let token = '';
  let userUuid = '';

  beforeAll(async () => {
    adminToken = await getAdminToken(server, 'test@example.com', 'password');
    tenant = await createTenant(server, adminToken);
    await registerUser(server, adminToken, tenant.uuid, {
      code: 'alice',
      password: 'password',
      name: 'Alice Doe',
      displayName: 'Alice',
      email: 'alice@example.com',
    });
    token = await getUserToken(server, tenant.code, 'alice', 'password');
  });

  test('ユーザーの作成', async () => {
    const response = await request(server)
      .post(`/v1/users/~/users`)
      .set('Authorization', `bearer ${token}`)
      .send({
        code: 'bob',
        password: 'password',
        name: 'Bob Doe',
        displayName: 'Bob',
        email: null,
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      uuid: expect.any(String),
      state: 'active',
      name: 'Bob Doe',
      displayName: 'Bob',
      email: null,
    });
    userUuid = response.body.uuid;
  });

  test('ユーザー一覧の取得', async () => {
    const response = await request(server)
      .get('/v1/users/~/users')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(2); // aliceとbob
    expect(response.body).toEqual([
      {
        uuid: expect.any(String),
        state: 'active',
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
      },
      {
        uuid: userUuid,
        state: 'active',
        name: 'Bob Doe',
        displayName: 'Bob',
        email: null,
      },
    ]);
  });

  test('ユーザーの取得', async () => {
    const response = await request(server)
      .get(`/v1/users/~/users/${userUuid}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      uuid: userUuid,
      state: 'active',
      name: 'Bob Doe',
      displayName: 'Bob',
      email: null,
    });
  });
});
