import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';
import { AdministratorModel } from 'share/models/administrator.model';

import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthRepository } from './admin-auth.repository';
import { AdminAuthUsecase } from './admin-auth.usecase';
import { AdminLocalStrategy } from './admin-local.strategy';
import { AdminJwtStrategy } from './admin-jwt.strategy';

@Module({
  controllers: [AdminAuthController],
  providers: [
    AdminAuthService,
    AdminAuthUsecase,
    AdminAuthRepository,
    BcryptService,
    AdminLocalStrategy,
    AdminJwtStrategy,
  ],
  imports: [
    PassportModule.register({ session: true }),
    SequelizeModule.forFeature([AdministratorModel]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [AdminAuthUsecase],
})
export class AdminAuthModule {}
