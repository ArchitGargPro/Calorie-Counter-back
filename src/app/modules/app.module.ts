import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from '../controllers/user.controller';
import MealController from '../controllers/meal.controller';
import { UserService } from '../services/user.service';
import { MealService } from '../services/meal.service';
import UserModule from './user.module';
import MealModule from './meal.module';
import UserEntity from '../db/entities/user.entity';
import MealEntity from '../db/entities/meal.entity';
import AccessModule from './access.module';
import AccessEntity from '../db/entities/access.entity';
import AccessController from '../controllers/access.controller';
import { AccessService } from '../services/access.service';

@Module({
  imports: [UserModule,
            MealModule,
            AccessModule,
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'test.db',
        entities: [UserEntity, MealEntity, AccessEntity],
        synchronize: true,
        logging: true,
  })],
  controllers: [AppController, UserController, MealController, AccessController],
  providers: [AppService, UserService, MealService, AccessService],
})
export class AppModule {}
