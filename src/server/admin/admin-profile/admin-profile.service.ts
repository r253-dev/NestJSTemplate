import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminProfileService {
  async test() {
    return `success`;
  }
}
