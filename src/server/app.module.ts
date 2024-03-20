import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { AdminModule } from 'admin/admin.module';
import { AdminAuthModule } from 'auth/admin-auth/admin-auth.module';
import { AppController } from './app.controller';
import { AdminJwtAuthGuard } from 'guards/admin-jwt-auth.guard';
import { RolesGuard } from 'guards/roles.guard';

@Module({
  imports: [
    SequelizeModule.forRoot({
      logQueryParameters: true,
      ...getDatabaseConfig(),
    }),
    AdminModule,
    AdminAuthModule,
  ],
  controllers: [AppController],
  providers: [RolesGuard, AdminJwtAuthGuard],
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
