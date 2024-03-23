import * as request from 'supertest';

export type Tenant = {
  uuid: string;
  code: string;
};

export async function createTenant(server: any, token: string): Promise<Tenant> {
  const code = `tenant-${process.env.JEST_WORKER_ID}-${Date.now()}`;

  const response = await request(server)
    .post('/v1/admin/~/tenants')
    .set('Authorization', `Bearer ${token}`)
    .send({
      code,
    });

  expect(response.status).toEqual(201);

  return {
    uuid: response.body.uuid,
    code: response.body.tenant,
  };
}
