import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import UserController from '../controllers/user.controller';
import UserEntity from '../db/entities/user.entity';
import AccessModule from './access.module';
import { AccessService } from '../services/access.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AccessModule],
  controllers: [UserController],
  providers: [UserService, AccessService],
})

class UserModule {
}

export default UserModule;
