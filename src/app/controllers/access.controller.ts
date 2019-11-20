import { Body, Controller, Post } from '@nestjs/common';
import { AccessService } from '../services/access.service';
import ServiceResponse from '../services/ServiceResponse';
import LoginDTO from '../schema/access.schema';
import EAccess from '../enums/access.enum';
import UserInterface from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Controller('logout')
export default class AccessController {
  constructor(private readonly accessService: AccessService,
              private readonly userService: UserService) {}

  @Post()
  async logout(): Promise<ServiceResponse> {
    return ServiceResponse.success(await this.accessService.logOut(), 'Successfully Logged Out');
  }
  @Post('login')
  async login(@Body() loginCredentials: LoginDTO): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() !== EAccess.DEFAULT) {
      await this.accessService.logOut();
    }
    const user: UserInterface = await this.userService.findByUserName(loginCredentials.userName);
    if ( !user ) {
      return ServiceResponse.error('LOGIN Failed: Check your UserName');
    } else {
      if (AccessController.authenticate(user, loginCredentials.password)) {
        await this.accessService.UpdateAccess(user.userName, user.access);
        return ServiceResponse.success(user, 'LOGIN Successful');
      } else {
        return ServiceResponse.error('LOGIN Failed: Incorrect Password');
      }
    }
  }

  private static authenticate(user: UserInterface, password: string): boolean {
    return user.password === password;
  }
}
