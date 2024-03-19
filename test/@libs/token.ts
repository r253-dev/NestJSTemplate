import * as request from 'supertest';

export async function getAdminToken(server: any, email: string, password: string) {
  const response = await request(server).post('/v1/auth/admin').send({ email, password });

  return response.body.token;
}
