import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserManageOrganizationController } from './user-manage-organization.controller';
import { UserManageOrganizationService } from './user-manage-organization.service';
import { UserManageOrganizationUsecase } from './user-manage-organization.usecase';
import { UserManageOrganizationRepository } from './user-manage-organization.repository';
import { AdminManageTenantModule } from 'admin/admin-manage-tenant/admin-manage-tenant.module';
import { OrganizationModel } from 'share/models/organization.model';

@Module({
  controllers: [UserManageOrganizationController],
  providers: [
    UserManageOrganizationService,
    UserManageOrganizationUsecase,
    UserManageOrganizationRepository,
  ],
  imports: [SequelizeModule.forFeature([OrganizationModel]), AdminManageTenantModule], // TODO: ユーザー側のテナントモジュールに変更
})
export class UserManageOrganizationModule {}
