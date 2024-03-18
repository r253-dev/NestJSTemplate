import { Injectable } from '@nestjs/common';
import { AdminRegistrationUsecase } from './admin-registration.usecase';
import { AdministratorRegistrationResponseDto } from './dto/registration.dto';
import { EMailService } from 'email/email.service';

@Injectable()
export class AdminRegistrationService {
  constructor(
    private usecase: AdminRegistrationUsecase,
    private emailService: EMailService,
  ) {}

  async register(createAdministratorDto: {
    email: string;
  }): Promise<AdministratorRegistrationResponseDto> {
    try {
      const result = await this.usecase.register(createAdministratorDto);
      if (result !== null) {
        await this.emailService.sendAdminRegistration(createAdministratorDto.email, {
          url: 'https://example.com', // TODO: 本来はサービスサイトのURLを生成する
        });
      }
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
