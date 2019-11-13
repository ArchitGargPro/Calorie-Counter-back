import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  showInfo(): string {
    return 'Use: /user to view all\n' +
      '/user/new to create\n' +
      '/user/:id to view by ID\n' +
      '/meal to view your meals';
  }
}
