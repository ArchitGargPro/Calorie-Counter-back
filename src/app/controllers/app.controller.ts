import { Body, Controller, Get, Post } from '@nestjs/common';
import LoginDTO from '../schema/access.schema';
import UserInterface from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { AccessService } from '../services/access.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService,
              private readonly accessService: AccessService) {}

  @Get()
  showInfo(): string {
    return 'Use: /user to view all\n' +
      '/user/new to create\n' +
      '/user/:id to view by ID\n' +
      '/meal to view your meals';
  }
  @Post('login')
  async login(@Body() loginCredentials: LoginDTO): Promise<boolean> {
    const user: UserInterface = await this.userService.findByUserName(loginCredentials.userName);
    if ( !user ) {
      return false;
    } else {
      console.log('==> here #############', user);
      if (user.password === loginCredentials.password) {
        await this.accessService.UpdateAccess(user.userName, user.access);
        return true;
      }
    }
  }
}
