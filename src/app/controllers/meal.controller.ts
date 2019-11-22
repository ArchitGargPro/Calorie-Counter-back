import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateMealDTO, IDates, ITime } from '../schema/meal.schema';
import { MealService } from '../services/meal.service';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../services/ServiceResponse';
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
    // if ( thisUser.access === EAccess.USER || thisUser.access === EAccess.ADMIN) {
    // todo
      return ServiceResponse.success(await this.mealService.insert(meal, thisUser.userName));
    // } else {
    //   return ServiceResponse.error('Please Login as USER/ADMIN to add your meal');
    // }
  }

  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async getAllMeals( @GetUser() thisUser: UserEntity ): Promise<ServiceResponse> {
    // if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
    // todo
    return ServiceResponse.success(await this.mealService.getAll(thisUser.userName));
    // } else {
    //   return ServiceResponse.error('Please Login as USER/ADMIN to view your meals');
    // }
  }

  @Get('/byDate')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async getMealsByDate(@Body() dates: IDates ): Promise<ServiceResponse> {
    // if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.getMealByDate(dates.fromDate, dates.toDate));
    // } else {
    //   return ServiceResponse.error('Please Login as USER/ADMIN to view your meals');
    // }
  }

  @Get('/byTime')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  async getMealsByTime(@Body() time: ITime ): Promise<ServiceResponse> {
    // if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.getMealByTime(time.fromTime, time.toTime));
    // } else {
    //   return ServiceResponse.error('Please Login as USER/ADMIN to view your meals');
    // }
  }

  @Get('/of/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ADMIN]))
  async getMeal(@Param('userName') userName: string): Promise<ServiceResponse> {
    // if (await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.getMeal(userName));
    // } else {
    //   return ServiceResponse.error('Only ADMIN can view meals of other users');
    // }
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async updateMeal( @Param('id') id: number , @Body() meal: CreateMealDTO): Promise<ServiceResponse> {
    // if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.update(id , meal));
    // } else {
    //   return ServiceResponse.error('Please Login as USER/ADMIN to update your meal');
    // }
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async deleteMeal(@Param('id') id: number): Promise<ServiceResponse> {
    // if (await this.accessService.getAccess() === EAccess.USER || await this.accessService.getAccess() === EAccess.ADMIN) {
      return ServiceResponse.success(await this.mealService.delete(id));
    // } else {
    //   return ServiceResponse.error('Please Login as USER/ADMIN to delete your meal');
    // }
  }

}
