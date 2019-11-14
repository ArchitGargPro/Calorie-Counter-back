import { Body, Controller, Post } from '@nestjs/common';
import { AccessService } from '../services/access.service';
import LoginDTO from '../schema/access.schema';
import { UserService } from '../services/user.service';
import UserInterface from '../interfaces/user.interface';

@Controller('login')
export default class AccessController {
  constructor(private readonly accessService: AccessService,
              private readonly userService: UserService) {
  }

  @Post()
  async login(@Body() loginCredentials: LoginDTO): Promise<boolean> {
    const user: UserInterface = await this.userService.findByUserName(loginCredentials.userName);
    if ( !user ) {
      return false;
    } else {
      if (user.password === loginCredentials.password) {
        await this.accessService.UpdateAccess(user.userName, user.access);
        return true;
      }
    }
  }
}
