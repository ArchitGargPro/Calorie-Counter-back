import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { CreateMealDTO, IDates, ITime } from '../schema/meal.schema';
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

  @Get('/byDate')
  async getMealsByDate(@Body() dates: IDates  ) {
    console.log(dates.fromDate);
    console.log(dates.toDate);
    return await this.mealService.getMealByDate(dates.fromDate, dates.toDate);
  }
  @Get('/byTime')
  async getMealsByTime(@Body() time: ITime  ) {
    console.log('in Time');
    console.log(time.fromTime);
    console.log(time.toTime);
    return await this.mealService.getMealByTime(time.fromTime, time.toTime);
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
