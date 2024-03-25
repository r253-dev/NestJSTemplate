import { Module } from '@nestjs/common';

import { UserManageOrganizationModule } from './user-manage-organization/user-manage-organization.module';
import { UserProfileModule } from './user-profile/user-profile.module';

const modules = [UserManageOrganizationModule, UserProfileModule];

@Module({
  imports: [...modules],
})
export class UserModule {}
