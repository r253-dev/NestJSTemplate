import { Injectable } from '@nestjs/common';
import { AdministratorRepository } from './admin-profile.repository';

@Injectable()
export class AdminProfileService {
  constructor(private repository: AdministratorRepository) {}

  async test() {
    const count = await this.repository.count();
    return `count: ${count}`;
  }
}
