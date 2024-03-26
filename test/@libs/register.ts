import * as request from 'supertest';
import { AdminManageUserCreationDto } from 'admin/admin-manage-user/dto/admin-manage-user-creation-dto';

export async function registerUser(
  server: any,
  adminToken: string,
  tenantUuid: string,
  params: AdminManageUserCreationDto,
) {
  const response = await request(server)
    .post(`/v1/admin/~/tenants/${tenantUuid}/users`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ ...params });

  expect(response.status).toEqual(201);
}
