import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'share/models/user.model';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';

@Module({
  controllers: [UserProfileController],
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserProfileService],
})
export class UserProfileModule {}
