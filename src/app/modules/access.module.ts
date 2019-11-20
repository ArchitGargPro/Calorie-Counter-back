import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccessEntity from '../db/entities/access.entity';
import AccessController from '../controllers/access.controller';
import { AccessService } from '../services/access.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessEntity])],
  controllers: [AccessController],
  providers: [AccessService, UserService],
})

class AccessModule {
}

export default AccessModule;
