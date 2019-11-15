import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { CreateMealDTO } from '../schema/meal.schema';
import { MealService } from '../services/meal.service';

@Controller('meal')
export default class MealController {
  constructor(private readonly mealService: MealService) {
  }
  @Post()
  postMeal( @Body() meal: CreateMealDTO) {
    return this.mealService.insert(meal);
  }
  @Get()
  getAllMeals() {
    return this.mealService.getAll();
  }
  @Get(':id')
  getMeal(@Param() params) {
    return this.mealService.getMeal(params.id);
  }
  @Put(':id')
  updateMeal( @Param() id: number , @Body() meal: CreateMealDTO) {
    return this.mealService.update(id , meal);
  }
  @Delete(':id')
  deleteMeal(@Param() id: number) {
    return this.mealService.delete(id);
  }
}
