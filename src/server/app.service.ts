import { Injectable } from '@nestjs/common';
import { sequelize } from 'vendors/sequelize/sequelize';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getEnv() {
    await sequelize.query('SELECT 1');
    return {
      NODE_ENV: process.env.NODE_ENV,
    };
  }
}
