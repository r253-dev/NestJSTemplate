import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from 'admin/admin.module';

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
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
