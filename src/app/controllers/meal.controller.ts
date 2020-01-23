import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CreateMealDTO, IFilters, IUpdateMealDTO } from '../schema/meal.schema';
import { MealService } from '../services/meal.service';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../utils/ServiceResponse';
import { AuthDetails } from '../utils/AuthDetails.decorator';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import AuthDetail from '../interfaces/AuthDetails';
import { createMealValidationSchema, filtersValidationSchema, updateMealValidationSchema } from '../schema/ValidationSchemaMeal';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('meal')
export default class MealController {

  constructor(private readonly mealService: MealService) {
  }

  @Post('/new')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async postMeal( @Body(new JoiValidationPipe(createMealValidationSchema)) meal: CreateMealDTO,
                  @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    if (authDetail.currentUser.access === EAccess.ADMIN) {
      return await this.mealService.insert(meal, meal.userName, authDetail.currentUser.access);
    }
    return await this.mealService.insert(meal, authDetail.currentUser.userName, authDetail.currentUser.access);
  }

  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async getFilteredMeals(@Query(new JoiValidationPipe(filtersValidationSchema)) filters: IFilters,
                         @AuthDetails() authDetail: AuthDetail,
                         @Query('page') page: number = 0,
                         @Query('limit') limit: number = 10): Promise<ServiceResponse> {
    limit = limit > 100 ? 100 : limit;
    return await this.mealService.getMeals(filters, authDetail.currentUser, {page, limit});
  }

  @Put('/update')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async updateMeal(@Body(new JoiValidationPipe(updateMealValidationSchema)) meal: IUpdateMealDTO): Promise<ServiceResponse> {
      return await this.mealService.update(meal);
  }

  @Delete('/remove/:id')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.ADMIN]))
  async deleteMeal(@Param('id') id: number): Promise<ServiceResponse> {
      return await this.mealService.delete(id);
  }
}
