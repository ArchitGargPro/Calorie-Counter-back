import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import UserController from '../controllers/user.controller';
import UserEntity from '../db/entities/user.entity';
import AuthService from '../services/auth.service';
import AuthenticationGuard from '../guards/authentication.guard';
import EAccess from '../enums/access.enum';
import RolesGuard from '../guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthService, AuthenticationGuard, {useValue: EAccess, provide: RolesGuard}],
})

class UserModule {
}

export default UserModule;
