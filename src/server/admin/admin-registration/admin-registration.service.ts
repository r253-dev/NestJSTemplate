import { Injectable } from '@nestjs/common';
import { AdminRegistrationUsecase } from './admin-registration.usecase';
import { AdministratorRegistrationResponseDto } from './dto/registration.dto';

@Injectable()
export class AdminRegistrationService {
  constructor(private usecase: AdminRegistrationUsecase) {}

  async register(createAdministratorDto: {
    email: string;
  }): Promise<AdministratorRegistrationResponseDto> {
    try {
      await this.usecase.register(createAdministratorDto);
    } catch (e) {
      return {
        status: 'failed',
      };
    }

    return {
      status: 'success',
    };
  }
}
