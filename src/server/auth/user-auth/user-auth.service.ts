import { Injectable } from '@nestjs/common';
import { UserAuthResponseDto } from './dto/auth.dto';
import { UserEntity } from './entities/user.entity';
import { UserAuthUsecase } from './user-auth.usecase';

@Injectable()
export class UserAuthService {
  constructor(private usecase: UserAuthUsecase) {}

  async issueToken(user: UserEntity): Promise<UserAuthResponseDto> {
    const token = await this.usecase.issueToken(user);

    return {
      token: token,
    };
  }
}
