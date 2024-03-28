import { Module } from '@nestjs/common';

import { UserManageOrganizationModule } from './user-manage-organization/user-manage-organization.module';
import { UserManageUserModule } from './user-manage-user/user-manage-user.module';
import { UserProfileModule } from './user-profile/user-profile.module';

const modules = [UserManageOrganizationModule, UserManageUserModule, UserProfileModule];

@Module({
  imports: [...modules],
})
export class UserModule {}
