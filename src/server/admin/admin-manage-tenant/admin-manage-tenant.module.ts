import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminManageTenantController } from './admin-manage-tenant.controller';
import { AdminManageTenantService } from './admin-manage-tenant.service';
import { AdminManageTenantUsecase } from './admin-manage-tenant.usecase';
import { AdminManageTenantRepository } from './admin-manage-tenant.repository';
import { TenantModel } from 'share/models/tenant.model';

@Module({
  controllers: [AdminManageTenantController],
  providers: [AdminManageTenantService, AdminManageTenantUsecase, AdminManageTenantRepository],
  imports: [SequelizeModule.forFeature([TenantModel])],
})
export class AdminManageTenantModule {}
