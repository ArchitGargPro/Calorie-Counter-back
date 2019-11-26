import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from '../services/auth.service';
import ServiceResponse from '../utils/ServiceResponse';
import UserEntity from '../db/entities/user.entity';

@Injectable()
class AuthenticationGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtToken = await (request).headers.jwttoken;
    const user: UserEntity = await this.validateJWTToken(jwtToken);
    if (user) {
      request.user = user;
      request.jwtToken = jwtToken;
      return true;
    } else {
      return false;
    }
  }

  public async validateJWTToken(token: string): Promise<UserEntity> {
    const response: ServiceResponse = await this.authService.validateJWTToken(token);

    if (response.success) {
      return response.data;
    } else {
      throw new UnauthorizedException(response.message);
    }
  }
}

export default AuthenticationGuard;
