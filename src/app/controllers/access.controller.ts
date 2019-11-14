import { Controller, Post } from '@nestjs/common';
import { AccessService } from '../services/access.service';

@Controller('logout')
export default class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post()
  async logout(): Promise<any> {
    return this.accessService.logOut();
  }
}
