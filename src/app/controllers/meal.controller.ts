import { Controller } from '@nestjs/common';
import { MealService } from '../services/meal.service';

@Controller()
export default class MealController {
  constructor(private readonly mealService: MealService) {
  }
}
