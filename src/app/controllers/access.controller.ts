import { Body, Controller, Post } from '@nestjs/common';
import ServiceResponse from '../services/ServiceResponse';
import LoginDTO from '../schema/access.schema';
import { UserService } from '../services/user.service';
import UserEntity from '../db/entities/user.entity';
import AuthService from '../services/auth.service';

@Controller()
export default class AccessController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {}

  // @Post('logout')
  // async logout(): Promise<ServiceResponse> {
  //   return ServiceResponse.success(await this.accessService.logOut(), 'Successfully Logged Out');
  // }

  @Post('login')
  async login(@Body() loginCredentials: LoginDTO): Promise<ServiceResponse | string> {
    // if (await this.accessService.getAccess() !== EAccess.DEFAULT) {
    //   await this.accessService.logOut();
    // }
    const {userName, password} = loginCredentials;
    const user: UserEntity = await this.userService.findByUserName(userName);
    if ( !user ) {
      return ServiceResponse.error('LOGIN Failed: Check your UserName');
    }
    if (AccessController.authenticate(user, password)) {
      return ServiceResponse.success(await this.authService.generateJWTToken(user), 'Logged in Successfully');
    }
    // } else {
    //   if (AccessController.authenticate(user, loginCredentials.password)) {
    //     await this.accessService.UpdateAccess(user.userName, user.access);
    //     return ServiceResponse.success(user, 'LOGIN Successful');
    //   } else {
    //     return ServiceResponse.error('LOGIN Failed: Incorrect Password');
    //   }
    // }
  }

  private static authenticate(user: UserEntity, password: string): boolean {
    // Encryption OR Hashing can be applied here
    return user.password === password;
  }
}
