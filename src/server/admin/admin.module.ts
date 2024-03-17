import { Module } from '@nestjs/common';
import { AdminProfileModule } from './admin-profile/admin-profile.module';

const modules = [AdminProfileModule];

@Module({
  imports: [...modules],
})
export class AdminModule {}
