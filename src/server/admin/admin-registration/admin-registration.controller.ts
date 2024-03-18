import { Controller, Post, Body, UsePipes, HttpStatus } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { AdminRegistrationService } from './admin-registration.service';

import {
  AdministratorRegistrationDto,
  AdministratorRegistrationResponseDto,
} from './dto/registration.dto';
import { Swagger } from 'share/decorators/swagger';

@Controller('administrators')
@ApiTags('administrator')
@UsePipes(ZodValidationPipe)
export class AdminRegistrationController {
  constructor(private readonly service: AdminRegistrationService) {}

  @Post()
  @Swagger({
    operationId: 'administratorRegistration',
    summary: '管理者の作成をリクエストする',
    description: '管理者の作成をリクエストする',
    responses: [
      {
        status: HttpStatus.CREATED,
        type: AdministratorRegistrationResponseDto,
      },
      { status: HttpStatus.BAD_REQUEST },
    ],
  })
  async register(
    @Body() body: AdministratorRegistrationDto,
  ): Promise<AdministratorRegistrationResponseDto> {
    return await this.service.register(body);
  }
}
