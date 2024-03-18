import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('パスワードのハッシュ化と検証', async () => {
    // パスワードのハッシュ化
    const saltLength = 10;
    const hash = await service.hash('password', saltLength);

    expect(hash).toEqual(expect.any(String));

    // パスワードの検証
    expect(await service.compare('password', hash)).toEqual(true);
    expect(await service.compare('p@ssw0rd', hash)).toEqual(false);
    expect(
      await service.compare(
        'password',
        '$2b$10$h16Y3k2LriL40/8TLjdyX.cXbSJm3FggySYpDvaUmTnaw8oGvgsZS',
      ),
    ).toEqual(true);
  });
});
