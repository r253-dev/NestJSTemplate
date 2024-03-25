import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminManagePrefectureController } from './admin-manage-prefecture.controller';
import { AdminManagePrefectureService } from './admin-manage-prefecture.service';
import { AdminManagePrefectureUsecase } from './admin-manage-prefecture.usecase';
import { AdminManagePrefectureRepository } from './admin-manage-prefecture.repository';
import { PrefectureModel } from 'share/models/prefecture.model';

@Module({
  controllers: [AdminManagePrefectureController],
  providers: [
    AdminManagePrefectureService,
    AdminManagePrefectureUsecase,
    AdminManagePrefectureRepository,
  ],
  imports: [SequelizeModule.forFeature([PrefectureModel])],
})
export class AdminManagePrefectureModule {}
