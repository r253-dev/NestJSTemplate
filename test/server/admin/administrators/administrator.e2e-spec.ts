import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createApp } from 'app';
import { getAdminToken } from '@libs/token';
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

const INACTIVE_ADMIN = {
  uuid: '2f18aeba-eb6f-4f84-91e3-7e72930ac8d7',
  email: 'inactive@example.com',
  createdAt: '2023-12-31T15:00:00.000Z',
} as const;

const REMOVED_ADMIN = {
  uuid: '41cd278a-b643-4896-bf18-10e0f33b768c',
  email: 'removed@example.com',
  createdAt: '2023-12-31T15:00:00.000Z',
} as const;

describe('認証が必要なエンドポイントへのアクセス', () => {
  test('認証されていないとアクセスできない', async () => {
    const response = await request(server).get('/v1/admin/~');

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });

  let token = '';
  test('tokenが正しければアクセスできる', async () => {
    token = await getAdminToken(server, 'test@example.com', 'password');
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

  test('ユーザー認証には通らない', async () => {
    const response = await request(server)
      .get('/v1/users/~')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(403);
    expect(response.body).toEqual({
      statusCode: 403,
      message: 'Forbidden',
    });
  });
});

describe('管理者の管理', () => {
  let token = '';

  test('管理者一覧の取得（削除された管理者は取得できない）', async () => {
    token = await getAdminToken(server, 'test@example.com', 'password');
    const response = await request(server)
      .get('/v1/admin/~/administrators')
      .query({
        perPage: 3,
      })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        uuid: '3b30345f-8890-4559-9af7-e243662296ca',
        email: 'test@example.com',
        createdAt: '2023-12-31T15:00:00.000Z',
      },
      {
        uuid: '2f18aeba-eb6f-4f84-91e3-7e72930ac8d7',
        email: 'inactive@example.com',
        createdAt: '2023-12-31T15:00:00.000Z',
      },
      {
        uuid: 'f4d587ec-7975-4d07-bc93-3f20c22c4d3c',
        email: 'disabled@example.com',
        createdAt: '2023-12-31T15:00:00.000Z',
      },
    ]);
    // ついでにperPageが効いていることの確認
    {
      const response = await request(server)
        .get('/v1/admin/~/administrators')
        .query({
          perPage: 4,
        })
        .set('Authorization', `bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    }
  });

  test('管理者数の取得', async () => {
    const response = await request(server)
      .get('/v1/admin/~/administrators/count')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(Number(response.text)).toBeGreaterThanOrEqual(3);
  });

  test('管理者の取得', async () => {
    const response = await request(server)
      .get(`/v1/admin/~/administrators/${INACTIVE_ADMIN.uuid}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(INACTIVE_ADMIN);
  });

  test('削除された管理者は取得できない', async () => {
    const response = await request(server)
      .get(`/v1/admin/~/administrators/${REMOVED_ADMIN.uuid}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Not Found',
    });
  });

  test('削除された管理者数の取得', async () => {
    const response = await request(server)
      .get('/v1/admin/~/administrators/@removed/count')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('1');
  });

  test('管理者の作成', async () => {
    await mockDate('2024-03-20T01:23:45.678Z', async () => {
      const response = await request(server)
        .post(`/v1/admin/~/administrators`)
        .set('Authorization', `bearer ${token}`)
        .send({
          email: 'create@example.com',
          password: 'create_password',
        });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        uuid: expect.any(String),
        email: 'create@example.com',
        createdAt: '2024-03-20T01:23:45.678Z',
      });
    });
  });

  test('既に存在するメールアドレスでは作成できない', async () => {
    const response = await request(server)
      .post(`/v1/admin/~/administrators`)
      .set('Authorization', `bearer ${token}`)
      .send({
        email: 'test@example.com',
        password: 'password',
      });

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Conflict',
    });
  });

  test('管理者の削除', async () => {
    let uuid = '';
    // 作って
    {
      const response = await request(server)
        .post(`/v1/admin/~/administrators`)
        .set('Authorization', `bearer ${token}`)
        .send({
          email: 'to-remove@example.com',
          password: 'to-remove_password',
        });

      expect(response.status).toEqual(201);
      uuid = response.body.uuid;
    }
    // 削除して
    {
      const response = await request(server)
        .delete(`/v1/admin/~/administrators/${uuid}`)
        .set('Authorization', `bearer ${token}`);

      expect(response.status).toEqual(204);
    }
    // 取得できないことを確認
    {
      const response = await request(server)
        .get(`/v1/admin/~/administrators/${uuid}`)
        .set('Authorization', `bearer ${token}`);

      expect(response.status).toEqual(404);
    }
  });

  test('削除された管理者の一覧を取得', async () => {
    const response = await request(server)
      .get('/v1/admin/~/administrators/@removed')
      .query({
        perPage: 2,
      })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      REMOVED_ADMIN,
      {
        uuid: expect.any(String),
        email: 'to-remove@example.com',
        createdAt: expect.any(String),
      },
    ]);
  });

  test('削除された管理者数の取得', async () => {
    const response = await request(server)
      .get('/v1/admin/~/administrators/@removed/count')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('2');
  });
});
