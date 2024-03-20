import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BcryptModule } from 'vendors/bcrypt/bcrypt.module';
import { AdministratorModel } from 'share/models/administrator.model';
import { AdminManageController } from './admin-manage.controller';
import { AdminManageService } from './admin-manage.service';
import { AdminManageUsecase } from './admin-manage.usecase';
import { AdminManageRepository } from './admin-manage.repository';

@Module({
  controllers: [AdminManageController],
  providers: [AdminManageService, AdminManageUsecase, AdminManageRepository],
  imports: [SequelizeModule.forFeature([AdministratorModel]), BcryptModule],
})
export class AdminManageModule {}
