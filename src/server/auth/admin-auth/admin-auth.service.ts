import { Injectable } from '@nestjs/common';
import { AdminAuthResponseDto } from './dto/auth.dto';
import { AdministratorEntity } from './entities/administrator.entity';
import { AdminAuthUsecase } from './admin-auth.usecase';

@Injectable()
export class AdminAuthService {
  constructor(private usecase: AdminAuthUsecase) {}

  async issueToken(administrator: AdministratorEntity): Promise<AdminAuthResponseDto> {
    const token = await this.usecase.issueToken(administrator);

    return {
      token: token,
    };
  }
}
