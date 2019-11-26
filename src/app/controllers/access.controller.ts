import { Body, Controller, Post } from '@nestjs/common';
import ServiceResponse from '../utils/ServiceResponse';
import LoginDTO from '../schema/access.schema';
import { UserService } from '../services/user.service';
import UserEntity from '../db/entities/user.entity';
import AuthService from '../services/auth.service';
import EMessages from '../enums/EMessages';

@Controller()
export default class AccessController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginCredentials: LoginDTO): Promise<ServiceResponse | string> {
    const {userName, password} = loginCredentials;
    const user: UserEntity = await this.userService.findByUserName(userName);
    if ( !user ) {
      return ServiceResponse.error(EMessages.INVALID_CREDENTIALS);
    }
    if (AccessController.authenticate(user, password)) {
      return ServiceResponse.success(await this.authService.generateJWTToken(user), 'Logged in Successfully');
    } else {
      return ServiceResponse.error(EMessages.INVALID_CREDENTIALS);
    }
  }

  private static authenticate(user: UserEntity, password: string): boolean {
    // Encryption OR Hashing can be applied here
    return user.password === password;
  }
}
