import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    operationId: 'getHello',
    summary: 'Hello World',
    description: 'Hello World',
  })
  @ApiOkResponse({ schema: { properties: { message: { type: 'string' } } } })
  getHello() {
    return { message: 'Hello World' };
  }
}
