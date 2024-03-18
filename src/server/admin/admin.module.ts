import { Module } from '@nestjs/common';
import { AdminProfileModule } from './admin-profile/admin-profile.module';
import { AdminRegistrationModule } from './admin-registration/admin-registration.module';

const modules = [AdminProfileModule, AdminRegistrationModule];

@Module({
  imports: [...modules],
})
export class AdminModule {}
