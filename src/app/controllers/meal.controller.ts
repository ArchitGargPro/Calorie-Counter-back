import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateMealDTO, IDates, ITime, IUpdateMealDTO } from '../schema/meal.schema';
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

  @Post('/new')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async postMeal( @Body() meal: CreateMealDTO, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
    if (thisUser.access === EAccess.ADMIN) {
      return await this.mealService.insert(meal, meal.userName);
    }
    return await this.mealService.insert(meal, thisUser.userName);
  }

  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async getAllMeals( @GetUser() thisUser: UserEntity ): Promise<ServiceResponse> {
    return await this.mealService.getAll(thisUser.userName);
  }

  @Get('/byDate')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async getMealsByDate(@Body() dates: IDates, @GetUser() thisUser: UserEntity ): Promise<ServiceResponse> {
    if (thisUser.access === EAccess.USER) {
      dates.userName = thisUser.userName;
    }
    return await this.mealService.getMealByDate(dates);
  }

  @Get('/byTime')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async getMealsByTime(@Body() time: ITime, @GetUser() thisUser: UserEntity ): Promise<ServiceResponse> {
    if (thisUser.access === EAccess.USER) {
      time.userName = thisUser.userName;
    }
    return await this.mealService.getMealByTime(time);
  }

  @Get('/of/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ADMIN]))
  async getMeal(@Param('userName') userName: string): Promise<ServiceResponse> {
      return await this.mealService.getMeal(userName);
  }

  @Put('/update')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async updateMeal(@Body() meal: IUpdateMealDTO): Promise<ServiceResponse> {
      return await this.mealService.update(meal);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async deleteMeal(@Param('id') id: number): Promise<ServiceResponse> {
      return await this.mealService.delete(id);
  }
}
