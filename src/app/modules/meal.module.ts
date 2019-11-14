import { Module } from '@nestjs/common';
import MealController from '../controllers/meal.controller';
import { MealService } from '../services/meal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import MealEntity from '../db/entities/meal.entity';
import AccessModule from './access.module';
import { AccessService } from '../services/access.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity]), AccessModule],
  controllers: [MealController],
  providers: [MealService, AccessService],
})

class MealModule {

}

export default MealModule;
