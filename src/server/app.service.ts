import { Injectable } from '@nestjs/common';
import { AdministratorRepository } from 'app.repository';
import { sequelize } from 'vendors/sequelize/sequelize';

@Injectable()
export class AppService {
  constructor(private repository: AdministratorRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getEnv() {
    await sequelize.query('SELECT 1');
    return {
      NODE_ENV: process.env.NODE_ENV,
      DB: 'ok',
    };
  }

  async test() {
    const count = await this.repository.count();
    return `count: ${count}`;
  }
}
