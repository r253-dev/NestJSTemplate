import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from 'admin/admin.module';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      logQueryParameters: true,
      ...getDatabaseConfig(),
    }),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

function getDatabaseConfig() {
  if (process.env.DB_URI) {
    return {
      uri: process.env.DB_URI,
    };
  }
  return {
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: (process.env.DB_DIALECT || 'mysql') as Dialect,
  };
}
