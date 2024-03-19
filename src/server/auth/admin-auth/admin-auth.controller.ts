import express from 'express';
import { Controller, Post, Body, UsePipes, HttpStatus, Req, HttpCode } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { Swagger } from 'share/decorators/swagger';
import { AdminAuthDto, AdminAuthResponseDto } from './dto/auth.dto';
import { AdminAuthService } from './admin-auth.service';

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
  async login(
    @Req() req: express.Request,
    @Body() body: AdminAuthDto,
  ): Promise<AdminAuthResponseDto> {
    return await this.service.login(req, body.email, body.password);
  }
}
