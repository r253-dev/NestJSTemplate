import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Swagger } from 'share/decorators/swagger';
import { Admin } from 'share/decorators/admin';
import { AdministratorEntityCore } from 'share/entities/administrator.core.entity';

import { AdminProfileResponseDto } from './dto/admin-profile.dto';
import { AdminProfileService } from './admin-profile.service';

@Controller('admin/~')
@ApiTags('administrator', '管理者のプロファイルモジュール')
export class AdminProfileController {
  constructor(private readonly service: AdminProfileService) {}

  @Get()
  @Swagger({
    operationId: 'getAdminProfile',
    summary: '管理者のプロフィールを取得する',
    description: '管理者のプロフィールを取得する',
    responses: [{ status: 200, type: AdminProfileResponseDto }],
  })
  getProfile(@Admin() admin: AdministratorEntityCore): AdminProfileResponseDto {
    return this.service.getProfile(admin);
  }
}
