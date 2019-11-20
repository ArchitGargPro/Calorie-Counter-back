import { Controller, Get } from '@nestjs/common';
import ServiceResponse from '../services/ServiceResponse';

@Controller()
export class AppController {

  @Get()
  showInfo(): ServiceResponse {
    return ServiceResponse.success('Use: /user to view all\n' +
      '/user/new to create\n' +
      '/user/:id to view by ID\n' +
      '/meal to view your meals');
  }

}
