import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Swagger } from 'share/decorators/swagger';
import { User } from 'share/decorators/user';
import { UserEntityCore } from 'share/entities/user.core.entity';

import { UserProfileResponseDto } from './dto/user-profile.dto';
import { UserProfileService } from './user-profile.service';

@Controller('users/~')
@ApiTags('user', 'ユーザーのプロファイルモジュール')
export class UserProfileController {
  constructor(private readonly service: UserProfileService) {}

  @Get()
  @Swagger({
    operationId: 'getUserProfile',
    summary: 'ユーザーのプロフィールを取得する',
    description: 'ユーザーのプロフィールを取得する',
    responses: [{ status: 200, type: UserProfileResponseDto }],
  })
  getProfile(@User() user: UserEntityCore): UserProfileResponseDto {
    return this.service.getProfile(user);
  }
}
