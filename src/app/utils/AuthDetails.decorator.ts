import {createParamDecorator} from '@nestjs/common';
import AuthDetail from '../interfaces/AuthDetails';

export const AuthDetails = createParamDecorator((data, req): AuthDetail => {
  return {
    currentUser: req.user,
  };
});
