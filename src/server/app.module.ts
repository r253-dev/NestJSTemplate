import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdministratorModel } from 'share/models/administrator.model';
import { AdministratorRepository } from 'app.repository';

@Module({
  imports: [
    SequelizeModule.forRoot({
      database: process.env.DATABASE,
      host: process.env.RDB_HOST,
      username: process.env.RDB_USER,
      password: process.env.RDB_PASS,
      dialect: 'mysql',
      logQueryParameters: true,
    }),
    SequelizeModule.forFeature([AdministratorModel]),
  ],
  controllers: [AppController],
  providers: [AppService, AdministratorRepository],
})
export class AppModule {}
