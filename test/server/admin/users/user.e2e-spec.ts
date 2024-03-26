import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';
import { getAdminToken } from '@libs/token';
// import mockDate from '@libs/date';
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

describe('テナント内のユーザー管理 (e2e)', () => {
  let tenant: Tenant = {
    uuid: '',
    code: '',
  };
  let adminToken = '';
  let aliceId = '';
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
          code: 'alice',
          password: 'password',
          name: 'Alice Doe',
          displayName: 'Alice',
          email: 'alice@example.com',
        });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        uuid: expect.any(String),
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
        createdAt: '2024-01-02T00:00:00.000Z',
      });
      aliceId = response.body.uuid;
    });
  });

  test('同一テナント内ではcodeの重複は許されない', async () => {
    const response = await request(server)
      .post(`/v1/admin/~/tenants/${tenant.uuid}/users`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'alice',
        password: 'password',
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice2@example.com',
      });

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({
      statusCode: 409,
      error: 'Conflict',
      message: '指定されたコードは既に使用されています',
    });
  });

  test('別テナントであればcodeを重複させることが出来る', async () => {
    const tenant2 = await createTenant(server, adminToken);
    const response = await request(server)
      .post(`/v1/admin/~/tenants/${tenant2.uuid}/users`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'alice',
        password: 'password',
        name: 'Alice Doe',
        displayName: 'Alice',
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      uuid: expect.any(String),
      name: 'Alice Doe',
      displayName: 'Alice',
      email: null,
      createdAt: expect.any(String),
    });
  });

  test('メールアドレスはシステム内で重複が許されない', async () => {
    const tenant3 = await createTenant(server, adminToken);
    const response = await request(server)
      .post(`/v1/admin/~/tenants/${tenant3.uuid}/users`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'alice',
        password: 'password',
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
      });

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({
      statusCode: 409,
      error: 'Conflict',
      message: '指定されたメールアドレスは既に使用されています',
    });
  });

  test('ユーザー一覧取得', async () => {
    const response = await request(server)
      .get(`/v1/admin/~/tenants/${tenant.uuid}/users`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        uuid: expect.any(String),
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
        createdAt: '2024-01-02T00:00:00.000Z',
      },
    ]);
  });

  test('ユーザー取得', async () => {
    const response = await request(server)
      .get(`/v1/admin/~/tenants/${tenant.uuid}/users/${aliceId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      uuid: expect.any(String),
      name: 'Alice Doe',
      displayName: 'Alice',
      email: 'alice@example.com',
      createdAt: '2024-01-02T00:00:00.000Z',
    });
  });

  test('ユーザーの削除', async () => {
    const response = await request(server)
      .delete(`/v1/admin/~/tenants/${tenant.uuid}/users/${aliceId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toEqual(204);
  });

  test('削除されたら（通常の方法では）ユーザーを取得できない', async () => {
    {
      const response = await request(server)
        .get(`/v1/admin/~/tenants/${tenant.uuid}/users`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    }
    {
      const response = await request(server)
        .get(`/v1/admin/~/tenants/${tenant.uuid}/users/${aliceId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: '指定されたユーザーは存在しません',
      });
    }
  });

  test('削除されたユーザーの取得', async () => {
    const response = await request(server)
      .get(`/v1/admin/~/tenants/${tenant.uuid}/users/@removed`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        uuid: expect.any(String),
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
        createdAt: '2024-01-02T00:00:00.000Z',
      },
    ]);
  });
});
