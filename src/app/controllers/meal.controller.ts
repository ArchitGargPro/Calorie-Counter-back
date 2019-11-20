import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { CreateMealDTO, IDates, ITime } from '../schema/meal.schema';
import { MealService } from '../services/meal.service';
import EAccess from '../enums/access.enum';
import { AccessService } from '../services/access.service';
import MealEntity from '../db/entities/meal.entity';
import ServiceResponse from '../services/ServiceResponse';

@Controller('meal')
export default class MealController {

  constructor(private readonly mealService: MealService,
              private readonly accessService: AccessService) {
  }

  @Post()
  async postMeal( @Body() meal: CreateMealDTO): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.insert(meal));
    } else {
      return ServiceResponse.error('Please Login as USER/ADMIN to add your meal');
    }
  }

  @Get()
  async getAllMeals(): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.getAll());
    } else {
      return ServiceResponse.error('Please Login as USER/ADMIN to view your meals');
    }
  }

  @Get('/byDate')
  async getMealsByDate(@Body() dates: IDates ): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.getMealByDate(dates.fromDate, dates.toDate));
    } else {
      return ServiceResponse.error('Please Login as USER/ADMIN to view your meals');
    }
  }

  @Get('/byTime')
  async getMealsByTime(@Body() time: ITime ): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.getMealByTime(time.fromTime, time.toTime));
    } else {
      return ServiceResponse.error('Please Login as USER/ADMIN to view your meals');
    }
  }

  @Get('/of/:userName')
  async getMeal(@Param('userName') userName: string): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.getMeal(userName));
    } else {
      return ServiceResponse.error('Only ADMIN can view meals of other users');
    }
  }

  @Put(':id')
  async updateMeal( @Param('id') id: number , @Body() meal: CreateMealDTO): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.update(id , meal));
    } else {
      return ServiceResponse.error('Please Login as USER/ADMIN to update your meal');
    }
  }

  @Delete(':id')
  async deleteMeal(@Param('id') id: number): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.delete(id));
    } else {
      return ServiceResponse.error('Please Login as USER/ADMIN to delete your meal');
    }
  }

}
