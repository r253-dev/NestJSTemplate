import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserManageUserController } from './user-manage-user.controller';
import { UserManageUserService } from './user-manage-user.service';
import { UserManageUserUsecase } from './user-manage-user.usecase';
import { UserManageUserRepository } from './user-manage-user.repository';
import { UserModel } from 'share/models/user.model';
import { BcryptModule } from 'vendors/bcrypt/bcrypt.module';

@Module({
  controllers: [UserManageUserController],
  providers: [UserManageUserService, UserManageUserUsecase, UserManageUserRepository],
  imports: [BcryptModule, SequelizeModule.forFeature([UserModel])],
})
export class UserManageUserModule {}
