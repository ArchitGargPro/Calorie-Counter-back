import { Controller, Get } from '@nestjs/common';
import { MealService } from '../services/meal.service';
import MealInterface from '../interfaces/meal.interface';

@Controller('meal')
export default class MealController {
  constructor(private readonly mealService: MealService) {
  }

  @Get()
  async findAll(): Promise<MealInterface[] | string> {
    const meal: MealInterface[] = await this.mealService.findAll();
    if (!meal) {
      return 'no users found';
    } else {
      return meal;
    }
  }
}
