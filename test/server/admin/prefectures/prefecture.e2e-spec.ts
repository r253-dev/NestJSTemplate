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

describe('都道府県の管理', () => {
  let token = '';
  let prefectureUuid = '';

  test('都道府県の作成', async () => {
    token = await getAdminToken(server, 'test@example.com', 'password');
    const response = await request(server)
      .post(`/v1/admin/~/prefectures`)
      .set('Authorization', `bearer ${token}`)
      .send({
        code: '99',
        name: 'テスト県',
        nameKana: 'テストケン',
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      uuid: expect.any(String),
      code: '99',
      name: 'テスト県',
      nameKana: 'テストケン',
    });
    prefectureUuid = response.body.uuid;
  });

  test('都道府県一覧の取得', async () => {
    const response = await request(server)
      .get('/v1/admin/~/prefectures')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(48);
    expect(response.body[0]).toEqual({
      uuid: '43768fca-e583-4baa-99d4-404f4e30a8e8',
      code: '01',
      name: '北海道',
      nameKana: 'ホッカイドウ',
    });
    expect(response.body[47]).toEqual({
      uuid: expect.any(String),
      code: '99',
      name: 'テスト県',
      nameKana: 'テストケン',
    });
  });

  test('都道府県数の取得', async () => {
    const response = await request(server)
      .get('/v1/admin/~/prefectures/count')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('48');
  });

  test('都道府県の取得', async () => {
    const response = await request(server)
      .get(`/v1/admin/~/prefectures/${prefectureUuid}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      uuid: prefectureUuid,
      code: '99',
      name: 'テスト県',
      nameKana: 'テストケン',
    });
  });

  test('既に存在するコードでは作成できない', async () => {
    const response = await request(server)
      .post(`/v1/admin/~/prefectures`)
      .set('Authorization', `bearer ${token}`)
      .send({
        code: '99',
        name: 'テスト府',
        nameKana: 'テストフ',
      });

    expect(response.status).toEqual(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Conflict',
    });
  });
});
