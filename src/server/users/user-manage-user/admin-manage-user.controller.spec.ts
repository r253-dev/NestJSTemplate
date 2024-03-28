import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserManageUserController } from './user-manage-user.controller';
import { UserManageUserService } from './user-manage-user.service';
import { TenantModel, State as TenantModelState } from 'share/models/tenant.model';
import { TenantEntity } from './entities/tenant.entity';
import { NotFoundException } from '@nestjs/common';
import { UserModel, State } from 'share/models/user.model';
import { UserEntity } from './entities/user.entity';

const tenant = TenantEntity.fromModel(
  new TenantModel({
    id: BigInt(1),
    code: 'tenant',
    uuid: 'daad09eb-ef5a-4d1e-8613-0a2fc93752ca',
    state: TenantModelState.ACTIVE,
    createdAt: new Date('2024-03-01T00:00:00+09:00'),
  }),
);

const user = UserEntity.fromModel(
  new UserModel({
    id: BigInt(1),
    tenantId: tenant.id,
    uuid: '93cfd7c7-84a5-4f52-ac4c-f9177924d20c',
    code: 'alice',
    passwordHash: '$2b$10$h16Y3k2LriL40/8TLjdyX.cXbSJm3FggySYpDvaUmTnaw8oGvgsZS',
    state: State.ACTIVE,
    name: 'Alice Doe',
    displayName: 'Alice',
    email: 'alice@example.com',
    createdAt: new Date('2024-03-01T00:00:00+09:00'),
  }),
);

class UserManageUserServiceMock {
  async create() {
    return user;
  }
  async findAll(_user: any, pagination: any) {
    return new Array(pagination.perPage).fill(user);
  }
  async findByUuid(_user: any, uuid: string) {
    if (uuid === user.uuid) {
      return user;
    }
    throw new NotFoundException();
  }
}

describe('UserManageOrganizationController', () => {
  let server: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserManageUserController],
      providers: [
        {
          provide: UserManageUserService,
          useClass: UserManageUserServiceMock,
        },
      ],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /users/~/users', () => {
    test('正常系', async () => {
      const response = await request(server).post(`/users/~/users`).send({
        code: 'alice',
        password: 'password',
        name: 'Alice Doe',
        displayName: 'Alice',
        email: 'alice@example.com',
      });
      expect(response.status).toEqual(201);
    });

    test('emailはnull指定できる', async () => {
      const response = await request(server).post(`/users/~/users`).send({
        code: 'alice',
        password: 'password',
        name: 'Alice Doe',
        displayName: 'Alice',
        email: null,
      });
      expect(response.status).toEqual(201);
    });

    test('ログインIDは3文字以上30文字以下', async () => {
      // 3文字
      {
        const response = await request(server).post(`/users/~/users`).send({
          code: 'bob',
          password: 'password',
          name: 'Bob Doe',
          displayName: 'Bob',
          email: null,
        });
        expect(response.status).toEqual(201);
      }
      // 30文字
      {
        const response = await request(server).post(`/users/~/users`).send({
          code: 'toBeOrNotToBeThatIsTheQuestion',
          password: 'william_password',
          name: 'William Shakespeare',
          displayName: 'Shakespeare',
          email: 'shakespeare@example.com',
        });
        expect(response.status).toEqual(201);
      }
      // 2文字
      {
        const response = await request(server).post(`/users/~/users`).send({
          code: 'bo',
          password: 'password',
          name: 'Bo Doe',
          displayName: 'Bo',
          email: null,
        });
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'Validation failed',
          errors: [
            {
              code: 'too_small',
              message: 'String must contain at least 3 character(s)',
              path: ['code'],
              type: 'string',
              minimum: 3,
              exact: false,
              inclusive: true,
            },
          ],
        });
      }
      // 31文字
      {
        const response = await request(server).post(`/users/~/users`).send({
          code: 'toBeOrNotToBeThatIsTheQuestion_',
          password: 'william_password',
          name: 'William Shakespeare',
          displayName: 'Shakespeare',
          email: 'shakespeare@example.com',
        });
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'Validation failed',
          errors: [
            {
              code: 'too_big',
              message: 'String must contain at most 30 character(s)',
              path: ['code'],
              type: 'string',
              maximum: 30,
              exact: false,
              inclusive: true,
            },
          ],
        });
      }
    });

    test('body指定が無いとNG', async () => {
      const response = await request(server).post(`/users/~/users`);
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['code'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['password'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['name'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['displayName'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['email'],
            expected: 'string',
            received: 'undefined',
          },
        ],
      });
    });
  });
});
