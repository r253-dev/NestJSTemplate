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

describe('管理者によるテナントの管理', () => {
  let token = '';
  let tenantId = '';

  describe('テナントの作成から取得等基本的CRUD', () => {
    test('テナントの作成', async () => {
      token = await getAdminToken(server, 'test@example.com', 'password');

      const response = await request(server)
        .post('/v1/admin/~/tenants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: 'tenant',
        });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        uuid: expect.any(String),
        code: 'tenant',
      });
      tenantId = response.body.uuid;
    });

    test('テナントコードを重複させることは出来ない', async () => {
      const response = await request(server)
        .post('/v1/admin/~/tenants')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: 'tenant',
        });

      expect(response.status).toEqual(409);
      expect(response.body).toEqual({
        statusCode: 409,
        error: 'Conflict',
        message: '指定されたコードは既に使用されています',
      });
    });

    test('テナント一覧の取得（削除されたテナントは取得できない）', async () => {
      {
        const response = await request(server)
          .get('/v1/admin/~/tenants')
          .query({
            perPage: 2,
            page: 1,
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(response.body).toEqual([
          {
            uuid: '81d6ca94-ae97-4232-a013-daed57b13253',
            code: 'test',
          },
          {
            uuid: '358ef591-a927-40c5-8078-27e76b159ba2',
            code: 'inactive',
          },
        ]);
      }
      {
        const response = await request(server)
          .get('/v1/admin/~/tenants/count')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(Number(response.text)).toBeGreaterThanOrEqual(4); // テストの実行順依存
      }
    });

    test('テナントの個別取得', async () => {
      const response = await request(server)
        .get(`/v1/admin/~/tenants/${tenantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        uuid: tenantId,
        code: 'tenant',
      });
    });

    test('テナントの削除', async () => {
      const response = await request(server)
        .delete(`/v1/admin/~/tenants/${tenantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(204);
    });

    test('削除されたテナントは取得できない', async () => {
      const response = await request(server)
        .get(`/v1/admin/~/tenants/${tenantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });

    test('削除されたテナントの一覧取得', async () => {
      {
        const response = await request(server)
          .get('/v1/admin/~/tenants/@removed')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(response.body).toEqual([
          {
            uuid: 'b27353bb-d3f3-4dbf-a28a-aba3ecf56cd0',
            code: 'removed',
          },
          {
            uuid: tenantId,
            code: 'tenant',
          },
        ]);
      }
      {
        const response = await request(server)
          .get('/v1/admin/~/tenants/@removed/count')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(200);
        expect(Number(response.text)).toEqual(2);
      }
    });
  });
});
