import { Injectable } from '@nestjs/common';
import UserEntity from '../db/entities/user.entity';
import JWT from 'jsonwebtoken';
import ConfigService from './config.service';
import EMessages from '../enums/EMessages';
import EUserStatus from '../enums/user-status.enum';
import ServiceResponse from './ServiceResponse';

@Injectable()
export default class AuthService {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  public async generateJWTToken(user: UserEntity) {
    const payload = {
      userName: user.userName,
    };
    return JWT.sign(payload,
      'secret',
      {});
  }

  public async validateJWTToken(jwtToken: string): Promise<ServiceResponse> {
    try {
      const decoded: any = JWT.verify(jwtToken, this.configService.get('JWT_SECRET'));
      const {user_id} = decoded;
      const user = await UserEntity.findOne({where: {id: user_id}});
      if (!user) {
        return ServiceResponse.error(EMessages.INVALID_AUTHENTICATION_TOKEN);
      }
      return ServiceResponse.success(user);
    } catch (e) {
      return ServiceResponse.error(EMessages.INVALID_AUTHENTICATION_TOKEN);
    }
  }
}
