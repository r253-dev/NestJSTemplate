import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createApp } from 'app';

describe('AppController (e2e)', () => {
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

  test('/ (GET)', async () => {
    const response = await request(server).get('/v1');

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('Hello World!');
  });

  test('/env (GET)', async () => {
    const response = await request(server).get('/v1/env');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      NODE_ENV: 'test',
      DB: 'ok',
    });
  });
});
