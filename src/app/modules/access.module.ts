import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import AuthService from '../services/auth.service';

@Module({
  providers: [UserService, AuthService],
})

class AccessModule {
}

export default AccessModule;
