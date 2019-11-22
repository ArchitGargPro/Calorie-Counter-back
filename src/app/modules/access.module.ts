import { Module } from '@nestjs/common';
import AccessController from '../controllers/access.controller';
import { UserService } from '../services/user.service';
import AuthService from '../services/auth.service';

@Module({
  controllers: [AccessController],
  providers: [UserService, AuthService],
})

class AccessModule {
}

export default AccessModule;
