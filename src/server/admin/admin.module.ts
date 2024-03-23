import { Module } from '@nestjs/common';

import { AdminManageModule } from './admin-manage/admin-manage.module';
import { AdminManageTenantModule } from './admin-manage-tenant/admin-manage-tenant.module';
import { AdminManageUserModule } from './admin-manage-user/admin-manage-user.module';
import { AdminProfileModule } from './admin-profile/admin-profile.module';
import { AdminRegistrationModule } from './admin-registration/admin-registration.module';

const modules = [
  AdminManageModule,
  AdminManageTenantModule,
  AdminManageUserModule,
  AdminProfileModule,
  AdminRegistrationModule,
];

@Module({
  imports: [...modules],
})
export class AdminModule {}
