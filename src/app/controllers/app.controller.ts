import { Controller, Get } from '@nestjs/common';
import ServiceResponse from '../utils/ServiceResponse';

@Controller()
export class AppController {

  @Get()
  showInfo(): ServiceResponse {
    return ServiceResponse.success(`Welcome to Calorie Counter, stay fit :)`);
  }

}
