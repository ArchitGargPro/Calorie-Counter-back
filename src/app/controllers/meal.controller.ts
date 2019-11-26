import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateMealDTO, IDates, ITime } from '../schema/meal.schema';
import { MealService } from '../services/meal.service';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../utils/ServiceResponse';
import { GetUser } from '../utils/getUser.decorator';
import UserEntity from '../db/entities/user.entity';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';

@Controller('meal')
export default class MealController {

  constructor(private readonly mealService: MealService) {
  }

  @Post()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async postMeal( @Body() meal: CreateMealDTO, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
      return ServiceResponse.success(await this.mealService.insert(meal, thisUser.userName));
  }

  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async getAllMeals( @GetUser() thisUser: UserEntity ): Promise<ServiceResponse> {
    return ServiceResponse.success(await this.mealService.getAll(thisUser.userName));
  }

  @Get('/byDate')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async getMealsByDate(@Body() dates: IDates ): Promise<ServiceResponse> {
      return ServiceResponse.success(await this.mealService.getMealByDate(dates.fromDate, dates.toDate));
  }

  @Get('/byTime')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async getMealsByTime(@Body() time: ITime ): Promise<ServiceResponse> {
      return ServiceResponse.success(await this.mealService.getMealByTime(time.fromTime, time.toTime));
  }

  @Get('/of/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ADMIN]))
  async getMeal(@Param('userName') userName: string): Promise<ServiceResponse> {
      return ServiceResponse.success(await this.mealService.getMeal(userName));
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async updateMeal( @Param('id') id: number , @Body() meal: CreateMealDTO): Promise<ServiceResponse> {
      return ServiceResponse.success(await this.mealService.update(id , meal));
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async deleteMeal(@Param('id') id: number): Promise<ServiceResponse> {
      return ServiceResponse.success(await this.mealService.delete(id));
  }

}
