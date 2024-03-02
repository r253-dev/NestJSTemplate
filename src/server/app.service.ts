import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getEnv(): string {
    return process.env.NODE_ENV || 'undefined';
  }
}
