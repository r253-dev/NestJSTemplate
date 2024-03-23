import { Controller, Post, UsePipes, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';
import { Swagger } from 'share/decorators/swagger';
import { UserAuthResponseDto } from './dto/auth.dto';
import { UserAuthService } from './user-auth.service';
import { UserEntity } from './entities/user.entity';
import { UserLocalAuthGuard } from 'guards/user-local-auth.guard';
import { User } from 'share/decorators/user';

@Controller('auth/user')
@ApiTags('auth')
@UsePipes(ZodValidationPipe)
export class UserAuthController {
  constructor(private readonly service: UserAuthService) {}

  @Post()
  @HttpCode(200)
  @Swagger({
    operationId: 'loginUser',
    summary: 'ユーザーとしてログインする',
    description: 'ユーザーとしてログインする',
    responses: [
      {
        status: HttpStatus.OK,
        type: UserAuthResponseDto,
      },
      { status: HttpStatus.BAD_REQUEST },
      { status: HttpStatus.UNAUTHORIZED },
    ],
  })
  @UseGuards(UserLocalAuthGuard)
  async login(@User() user: UserEntity): Promise<UserAuthResponseDto> {
    return await this.service.issueToken(user);
  }
}
