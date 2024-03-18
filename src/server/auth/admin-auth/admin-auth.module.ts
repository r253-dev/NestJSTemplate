import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';

import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthRepository } from './admin-auth.repository';
import { AdminAuthUsecase } from './admin-auth.usecase';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdministratorModel } from 'share/models/administrator.model';

@Module({
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminAuthUsecase, AdminAuthRepository, BcryptService],
  imports: [
    SequelizeModule.forFeature([AdministratorModel]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [AdminAuthUsecase],
})
export class AdminAuthModule {}
