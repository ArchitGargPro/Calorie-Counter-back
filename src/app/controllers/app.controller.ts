import { Body, Controller, Get, Post } from '@nestjs/common';
import LoginDTO from '../schema/access.schema';
import UserInterface from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { AccessService } from '../services/access.service';
import EAccess from '../enums/access.enum';

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
  async login(@Body() loginCredentials: LoginDTO): Promise<string> {
    if (await this.accessService.getAccess() !== EAccess.DEFAULT) {
      await this.accessService.logOut();
    }
    const user: UserInterface = await this.userService.findByUserName(loginCredentials.userName);
    if ( !user ) {
      return 'LOGIN Failed: Check your UserName';
    } else {
      if (user.password === loginCredentials.password) {
        await this.accessService.UpdateAccess(user.userName, user.access);
        return 'LOGIN Successful';
      } else {
        return 'LOGIN Failed: Incorrect Password';
      }
    }
  }
}
