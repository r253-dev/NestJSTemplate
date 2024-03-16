import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminProfileService } from './admin-profile.service';

@Controller('test')
@ApiTags('administrator')
export class AdminProfileController {
  constructor(private readonly service: AdminProfileService) {}

  @Get('test')
  @ApiOperation({
    operationId: 'test',
    summary: 'test',
    description: 'test',
  })
  @ApiOkResponse({ type: String })
  async test() {
    return await this.service.test();
  }
}
