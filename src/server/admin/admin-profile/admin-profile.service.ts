import { Injectable } from '@nestjs/common';
import { AdminProfileRepository } from './admin-profile.repository';

@Injectable()
export class AdminProfileService {
  constructor(private repository: AdminProfileRepository) {}

  async test() {
    const count = await this.repository.count();
    return `count: ${count}`;
  }
}
