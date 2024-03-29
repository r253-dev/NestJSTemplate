import { Module } from '@nestjs/common';
import { AdminRegistrationController } from './admin-registration.controller';
import { AdminRegistrationService } from './admin-registration.service';
import { AdminRegistrationUsecase } from './admin-registration.usecase';
import { AdminRegistrationRepository } from './admin-registration.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdministratorModel } from 'share/models/administrator.model';
import { EMailModule } from 'email/email.module';

@Module({
  controllers: [AdminRegistrationController],
  providers: [AdminRegistrationService, AdminRegistrationUsecase, AdminRegistrationRepository],
  imports: [SequelizeModule.forFeature([AdministratorModel]), EMailModule],
})
export class AdminRegistrationModule {}
