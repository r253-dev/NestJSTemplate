import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.notifySlack(exception, host);
    }
    super.catch(exception, host);
  }

  // そのうちslackに通知させる
  private notifySlack(exception: unknown, host: ArgumentsHost) {
    console.log('--↓↓↓ notify slack ↓↓↓--');
    console.log(exception);
    console.log(host);
    console.log('--↑↑↑ notify slack ↑↑↑--');
  }
}
