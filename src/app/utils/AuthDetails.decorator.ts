import {createParamDecorator} from '@nestjs/common';
// <<<<<<< HEAD
import AuthDetail from '../interfaces/AuthDetails';

export const AuthDetails = createParamDecorator((data, req): AuthDetail => {
// =======
// import UserEntity from '../db/entities/user.entity';
//
// interface AuthDetail {
//   currentUser: UserEntity;
// }
// export const Auth = createParamDecorator((data, req): AuthDetail => {
// >>>>>>> 3a8d911e250021e46402094373a4945afd2a1481
  return {
    currentUser: req.user,
  };
});
