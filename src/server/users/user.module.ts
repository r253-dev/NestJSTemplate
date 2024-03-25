import { Module } from '@nestjs/common';

import { UserProfileModule } from './user-profile/user-profile.module';

const modules = [UserProfileModule];

@Module({
  imports: [...modules],
})
export class UserModule {}
