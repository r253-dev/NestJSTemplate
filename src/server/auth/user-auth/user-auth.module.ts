import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { BcryptService } from 'vendors/bcrypt/bcrypt.service';
import { UserModel } from 'share/models/user.model';

import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { UserAuthRepository } from './user-auth.repository';
import { UserAuthUsecase } from './user-auth.usecase';
import { UserLocalStrategy } from './user-local.strategy';
import { UserJwtStrategy } from './user-jwt.strategy';

@Module({
  controllers: [UserAuthController],
  providers: [
    UserAuthService,
    UserAuthUsecase,
    UserAuthRepository,
    BcryptService,
    UserLocalStrategy,
    UserJwtStrategy,
  ],
  imports: [
    PassportModule.register({ session: true }),
    SequelizeModule.forFeature([UserModel]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [UserAuthUsecase],
})
export class UserAuthModule {}
