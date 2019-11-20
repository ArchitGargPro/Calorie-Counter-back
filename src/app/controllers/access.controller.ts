import { Controller, Post } from '@nestjs/common';
import { AccessService } from '../services/access.service';
import ServiceResponse from '../services/ServiceResponse';

@Controller('logout')
export default class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post()
  async logout(): Promise<ServiceResponse> {
    return ServiceResponse.success(await this.accessService.logOut(), 'Successfully Logged Out');
  }
}
