import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from 'app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    operationId: 'getHello',
    summary: 'Hello World',
    description: 'Hello World',
  })
  @ApiOkResponse({ type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  @ApiOperation({
    operationId: 'getEnvironment',
    summary: 'Environment Information',
    description: 'Environment Information',
  })
  @ApiOkResponse()
  async getEnv() {
    return await this.appService.getEnv();
  }

  @Get('test')
  @ApiOperation({
    operationId: 'test',
    summary: 'test',
    description: 'test',
  })
  @ApiOkResponse({ type: String })
  async test() {
    return await this.appService.test();
  }
}
