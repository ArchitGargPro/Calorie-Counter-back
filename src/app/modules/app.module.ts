import { Global, Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from '../controllers/user.controller';
import MealController from '../controllers/meal.controller';
import { UserService } from '../services/user.service';
import { MealService } from '../services/meal.service';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'test.db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
  })],
  controllers: [AppController, UserController, MealController],
  providers: [AppService, UserService, MealService],
})
export class AppModule {}
