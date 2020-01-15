import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateMealDTO, IFilters, IUpdateMealDTO } from '../schema/meal.schema';
import { MealService } from '../services/meal.service';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../utils/ServiceResponse';
import { AuthDetails } from '../utils/AuthDetails.decorator';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import AuthDetail from '../interfaces/AuthDetails';

@Controller('meal')
export default class MealController {

  constructor(private readonly mealService: MealService) {
  }

  @Post('/new')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async postMeal( @Body() meal: CreateMealDTO, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    if (authDetail.currentUser.access === EAccess.ADMIN) {
      return await this.mealService.insert(meal, meal.userName);
    }
    return await this.mealService.insert(meal, authDetail.currentUser.userName);
  }

  // @Get()
  // @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER]))
  // async getAllMeals(@GetUser() thisUser: UserEntity,
  //                   @Query('page') page: number = 0,
  //                   @Query('limit') limit: number = 10): Promise<ServiceResponse> {
  //   limit = limit > 100 ? 100 : limit;
  //   return await this.mealService.getMeal(thisUser.userName, {page, limit});
  // }

  // filtered content for admin
  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async getFilteredMeals(@Body() filters: IFilters,
                         @AuthDetails() authDetail: AuthDetail,
                         @Query('page') page: number = 0,
                         @Query('limit') limit: number = 10): Promise<ServiceResponse> {
    limit = limit > 100 ? 100 : limit;
    return await this.mealService.getMeals(filters, authDetail.currentUser, {page, limit});
  }

  // @Get('/byDate')
  // @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  // async getMealsByDate(@Body() dates: IDates,
  //                      @GetUser() thisUser: UserEntity ): Promise<ServiceResponse> {
  //   if (thisUser.access === EAccess.USER) {
  //     dates.userName = thisUser.userName;
  //   }
  //   return await this.mealService.getMealByDate(dates);
  // }

  // @Get('/byTime')
  // @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  // async getMealsByTime(@Body() time: ITime,
  //                      @GetUser() thisUser: UserEntity ): Promise<ServiceResponse> {
  //   if (thisUser.access === EAccess.USER) {
  //     time.userName = thisUser.userName;
  //   }
  //   return await this.mealService.getMealByTime(time);
  // }

  // @Get('/of/:userName')
  // @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ADMIN]))
  // async getMeal(@Param('userName') userName: string,
  //               @Query('page') page: number = 0,
  //               @Query('limit') limit: number = 10): Promise<ServiceResponse> {
  //   limit = limit > 100 ? 100 : limit;
  //   return await this.mealService.getMeal(userName, {page, limit});
  // }

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
