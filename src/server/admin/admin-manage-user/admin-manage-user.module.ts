import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BcryptModule } from 'vendors/bcrypt/bcrypt.module';
import { UserModel } from 'share/models/user.model';
import { AdminManageUserController } from './admin-manage-user.controller';
import { AdminManageUserService } from './admin-manage-user.service';
import { AdminManageUserUsecase } from './admin-manage-user.usecase';
import { AdminManageUserRepository } from './admin-manage-user.repository';
import { AdminManageTenantModule } from 'admin/admin-manage-tenant/admin-manage-tenant.module';

@Module({
  controllers: [AdminManageUserController],
  providers: [AdminManageUserService, AdminManageUserUsecase, AdminManageUserRepository],
  imports: [SequelizeModule.forFeature([UserModel]), BcryptModule, AdminManageTenantModule],
})
export class AdminManageUserModule {}
