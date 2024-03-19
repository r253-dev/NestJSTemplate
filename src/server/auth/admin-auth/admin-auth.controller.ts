import { Controller, Post, UsePipes, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';
import { Swagger } from 'share/decorators/swagger';
import { Admin } from 'share/decorators/admin';
import { AdminAuthResponseDto } from './dto/auth.dto';
import { AdminAuthService } from './admin-auth.service';
import { AdminLocalAuthGuard } from './admin-local-auth.guard';
import { AdministratorEntity } from './entities/administrator.entity';

@Controller('auth/admin')
@ApiTags('auth')
@UsePipes(ZodValidationPipe)
export class AdminAuthController {
  constructor(private readonly service: AdminAuthService) {}

  @Post()
  @HttpCode(200)
  @Swagger({
    operationId: 'loginAdministrator',
    summary: '管理者としてログインする',
    description: '管理者としてログインする',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminAuthResponseDto,
      },
      { status: HttpStatus.BAD_REQUEST },
      { status: HttpStatus.UNAUTHORIZED },
    ],
  })
  @UseGuards(AdminLocalAuthGuard)
  async login(@Admin() admin: AdministratorEntity): Promise<AdminAuthResponseDto> {
    return await this.service.issueToken(admin);
  }
}
