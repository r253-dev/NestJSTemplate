import { Module } from '@nestjs/common';
import { AdminProfileModule } from './admin-profile/admin-profile.module';
import { AdminRegistrationModule } from './admin-registration/admin-registration.module';
import { AdminManageModule } from './admin-manage/admin-manage.module';
import { AdminManageTenantModule } from './admin-manage-tenant/admin-manage-tenant.module';

const modules = [
  AdminManageModule,
  AdminManageTenantModule,
  AdminProfileModule,
  AdminRegistrationModule,
];

@Module({
  imports: [...modules],
})
export class AdminModule {}
