import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorModel, State } from 'share/models/administrator.model';

import { AdminRegistrationService } from './admin-registration.service';
import { AdminRegistrationUsecase } from './admin-registration.usecase';
import { AdminRegistrationRepository } from './admin-registration.repository';
import { EMailModule } from 'email/email.module';

class AdminRegistrationRepositoryMock {
  async findByEmail(email: string) {
    if (email === 'test@example.com') {
      return new AdministratorModel({
        id: BigInt(1),
        uuid: '9c1b2f59-7273-4a44-b901-fbbd11884b71',
        email: 'test@example.com',
        passwordHash: '$2b$10$h16Y3k2LriL40/8TLjdyX.cXbSJm3FggySYpDvaUmTnaw8oGvgsZS',
        state: State.ACTIVE,
        createdAt: new Date(),
      });
    }
    return null;
  }

  async save() {}
}

describe('AdministratorsService', () => {
  let service: AdminRegistrationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminRegistrationService,
        AdminRegistrationUsecase,
        {
          provide: AdminRegistrationRepository,
          useClass: AdminRegistrationRepositoryMock,
        },
      ],
      imports: [EMailModule],
    }).compile();

    service = module.get(AdminRegistrationService);
  });

  describe('管理者を作成', () => {
    test('許可されているメールアドレスで登録できる', async () => {
      const result = await service.register({
        email: 'r253.hmdryou@gmail.com',
      });

      expect(result).toEqual({
        status: 'success',
      });
    });

    test('新しいメールアドレスの場合、管理者を作成', async () => {
      const result = await service.register({
        email: 'new@example.com',
      });

      expect(result).toEqual({
        status: 'success',
      });
    });

    test('既に存在するメールアドレスでもリクエストは通る', async () => {
      const result = await service.register({
        email: 'test@example.com',
      });

      expect(result).toEqual({
        status: 'success',
      });
    });

    test('許可されていないドメインのメールアドレスは弾かれる', async () => {
      const result = await service.register({
        email: 'test@example.jp',
      });

      expect(result).toEqual({
        status: 'failed',
      });
    });
  });
});
