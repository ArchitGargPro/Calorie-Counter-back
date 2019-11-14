import { Module } from '@nestjs/common';
import MealController from '../controllers/meal.controller';
import { MealService } from '../services/meal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import MealEntity from '../db/entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity])],
  controllers: [MealController],
  providers: [MealService],
})

class MealModule {

}

export default MealModule;
