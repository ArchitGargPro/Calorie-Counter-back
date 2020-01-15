import {createParamDecorator} from '@nestjs/common';
import UserEntity from '../db/entities/user.entity';

interface AuthDetail {
  currentUser: UserEntity;
}
export const Auth = createParamDecorator((data, req): AuthDetail => {
  return {
    currentUser: req.user,
  };
});
