import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserManageOrganizationController } from './user-manage-organization.controller';
import { UserManageOrganizationService } from './user-manage-organization.service';
import { TenantModel, State as TenantModelState } from 'share/models/tenant.model';
import { TenantEntity } from './entities/tenant.entity';
import { OrganizationEntity } from './entities/organization.entity';
import { NotFoundException } from '@nestjs/common';
import { OrganizationModel, State } from 'share/models/organization.model';

const tenant = TenantEntity.fromModel(
  new TenantModel({
    id: BigInt(1),
    code: 'tenant',
    uuid: 'daad09eb-ef5a-4d1e-8613-0a2fc93752ca',
    state: TenantModelState.ACTIVE,
    createdAt: new Date('2024-03-01T00:00:00+09:00'),
  }),
);

const organization = OrganizationEntity.fromModel(
  new OrganizationModel({
    id: BigInt(1),
    tenantId: tenant.id,
    uuid: '6e3d3a52-f69f-4b91-a2f5-8eca19ee79e3',
    code: '0123456789',
    name: 'テスト事業所',
    nameKana: 'テストジギョウショ',
    state: State.ACTIVE,
    createdAt: new Date('2024-03-01T00:00:00+09:00'),
  }),
);

class UserManageOrganizationServiceMock {
  async create() {
    return organization;
  }
  async findAll(_user: any, pagination: any) {
    return new Array(pagination.perPage).fill(organization);
  }
  async findByUuid(_user: any, uuid: string) {
    if (uuid === organization.uuid) {
      return organization;
    }
    throw new NotFoundException();
  }
  async remove(_user: any, uuid: string) {
    if (uuid === organization.uuid) {
      return;
    }
    throw new NotFoundException();
  }
}

describe('UserManageOrganizationController', () => {
  let server: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserManageOrganizationController],
      providers: [
        {
          provide: UserManageOrganizationService,
          useClass: UserManageOrganizationServiceMock,
        },
      ],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /users/~/organizations', () => {
    test('正常系', async () => {
      const response = await request(server).post(`/users/~/organizations`).send({
        code: '0123456789',
        name: 'テスト事業所',
        nameKana: 'テストジギョウショ',
      });
      expect(response.status).toEqual(201);
    });

    test('codeもnull指定できる', async () => {
      const response = await request(server).post(`/users/~/organizations`).send({
        code: null,
        name: 'テスト事業所',
        nameKana: 'テストジギョウショ',
      });
      expect(response.status).toEqual(201);
    });

    test('事業所番号は10文字まで', async () => {
      const response = await request(server).post(`/users/~/organizations`).send({
        code: '01234567890',
        name: 'テスト事業所',
        nameKana: 'テストジギョウショ',
      });
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Validation failed',
        errors: [
          {
            code: 'too_big',
            message: 'String must contain at most 10 character(s)',
            path: ['code'],
            type: 'string',
            maximum: 10,
            inclusive: true,
            exact: false,
          },
        ],
      });
    });

    test('body指定が無いとNG', async () => {
      const response = await request(server).post(`/users/~/organizations`);
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
            path: ['name'],
            expected: 'string',
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            message: 'Required',
            path: ['nameKana'],
            expected: 'string',
            received: 'undefined',
          },
        ],
      });
    });
  });
});
