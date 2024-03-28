import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';
import { getAdminToken, getUserToken } from '@libs/token';
import mockDate from '@libs/date';
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

describe('事業所の管理', () => {
  let tenant: Tenant = {
    uuid: '',
    code: '',
  };
  let adminToken = '';
  let token = '';
  let organizationUuid = '';

  beforeAll(async () => {
    adminToken = await getAdminToken(server, 'test@example.com', 'password');
    tenant = await createTenant(server, adminToken);
    await registerUser(server, adminToken, tenant.uuid, {
      code: 'alice',
      password: 'password',
      name: 'test-user',
      displayName: 'Test User',
    });
    token = await getUserToken(server, tenant.code, 'alice', 'password');
  });

  test('事業所の作成', async () => {
    await mockDate('2024-03-20T01:23:45.678Z', async () => {
      const response = await request(server)
        .post(`/v1/users/~/organizations`)
        .set('Authorization', `bearer ${token}`)
        .send({
          code: null,
          name: 'テスト事業所',
          nameKana: 'テストジギョウショ',
        });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        uuid: expect.any(String),
        code: null,
        name: 'テスト事業所',
        nameKana: 'テストジギョウショ',
        state: 'active',
      });
      organizationUuid = response.body.uuid;
    });
  });

  test('事業所一覧の取得', async () => {
    const response = await request(server)
      .get('/v1/users/~/organizations')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        uuid: organizationUuid,
        code: null,
        name: 'テスト事業所',
        nameKana: 'テストジギョウショ',
        state: 'active',
      },
    ]);
  });

  test('事業所の取得', async () => {
    const response = await request(server)
      .get(`/v1/users/~/organizations/${organizationUuid}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      uuid: organizationUuid,
      code: null,
      name: 'テスト事業所',
      nameKana: 'テストジギョウショ',
      state: 'active',
    });
  });

  test('事業所を削除したら取得できない', async () => {
    // 削除
    {
      const response = await request(server)
        .delete(`/v1/users/~/organizations/${organizationUuid}`)
        .set('Authorization', `bearer ${token}`);

      expect(response.status).toEqual(204);
    }
    // 一覧取得は出来ない
    {
      const response = await request(server)
        .get('/v1/users/~/organizations')
        .set('Authorization', `bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(0);
      expect(response.body).toEqual([]);
    }
    // 個別取得ももちろんできない
    {
      const response = await request(server)
        .get(`/v1/users/~/organizations/${organizationUuid}`)
        .set('Authorization', `bearer ${token}`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: '指定された事業所は存在しません',
      });
    }
  });
});
