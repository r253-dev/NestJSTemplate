import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdministratorModel } from 'share/models/administrator.model';
import { AdminProfileController } from './admin-profile.controller';
import { AdminProfileService } from './admin-profile.service';
import { AdminProfileRepository } from './admin-profile.repository';

@Module({
  controllers: [AdminProfileController],
  imports: [SequelizeModule.forFeature([AdministratorModel])],
  providers: [AdminProfileService, AdminProfileRepository],
})
export class AdminProfileModule {}
