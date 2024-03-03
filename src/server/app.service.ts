import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getEnv() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      INSTANCE_CONNECTION_NAME: process.env.INSTANCE_CONNECTION_NAME,
    };
  }
}
