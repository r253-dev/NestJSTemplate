import * as request from 'supertest';

export async function getAdminToken(server: any, email: string, password: string) {
  const response = await request(server).post('/v1/auth/admin').send({ email, password });

  return response.body.token;
}

export async function getUserToken(
  server: any,
  tenantCode: string,
  code: string,
  password: string,
) {
  const response = await request(server).post(`/v1/auth/user`).send({
    tenantCode,
    code,
    password,
  });

  expect(response.status).toEqual(200);
  return response.body.token;
}
