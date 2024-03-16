import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdministratorModel } from 'share/models/administrator.model';
import { AdminProfileController } from './admin-profile.controller';
import { AdminProfileService } from './admin-profile.service';

@Module({
  controllers: [AdminProfileController],
  imports: [SequelizeModule.forFeature([AdministratorModel])],
  providers: [AdminProfileService],
})
export class AdminProfileModule {}
