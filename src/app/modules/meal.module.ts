import { Module } from '@nestjs/common';
import MealController from '../controllers/meal.controller';
import { MealService } from '../services/meal.service';
import { MealEntity } from '../db/entities/meal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity])],
  controllers: [MealController],
  providers: [MealService],
})

class MealModule {

}

export default MealModule;
