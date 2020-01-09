import { Injectable } from '@nestjs/common';
import MealEntity from '../db/entities/meal.entity';
import { CreateMealDTO, IDates, ITime, IUpdateMealDTO } from '../schema/meal.schema';
import * as moment from 'moment';
import UserEntity from '../db/entities/user.entity';
import EMessages from '../enums/EMessages';
import ServiceResponse from '../utils/ServiceResponse';

@Injectable()
export class MealService {

  async getAll(userName: string): Promise<ServiceResponse> {
    return await this.getMeal(userName);
  }

  async getMeal(userName: string): Promise<ServiceResponse> {
    const meals: MealEntity[] = await MealEntity.findByUser(await UserEntity.findByUserName(userName));
    if ( meals.length === 0 ) {
      return ServiceResponse.error('no meals found');
    } else {
      return ServiceResponse.success(meals, EMessages.RESOURCE_FOUND);
    }
  }

  async getMealByDate( dates: IDates): Promise<ServiceResponse> {
    const startDate = moment(dates.fromDate , 'DD/MM/YYYY');
    const endDate = moment(dates.toDate , 'DD/MM/YYYY');
    const allMeals: MealEntity[] = await MealEntity.findByUser(await UserEntity.getUserByUserName(dates.userName));
    const meals: MealEntity[] = [];
    for (const meal of allMeals) {
      const mealDate = moment( meal.date, 'DD/MM/YYYY');
      if ( mealDate.isBetween(startDate, endDate)) {
        meals.push(meal);
      }
    }
    if ( meals.length === 0 ) {
      return ServiceResponse.error('no meals found');
    } else {
      return ServiceResponse.success(meals, EMessages.RESOURCE_FOUND);
    }
  }

  async getMealByTime( time: ITime): Promise<ServiceResponse> {
    const startTime = moment(time.fromTime , 'HH:mm:ss');
    const endTime = moment(time.toTime , 'HH:mm:ss');
    const allMeals: MealEntity[] = await MealEntity.findByUser(await UserEntity.getUserByUserName(time.userName));
    const meals: MealEntity[] = [];
    for ( const meal of allMeals) {
      const mealTime = moment( meal.time, 'HH:mm:ss');
      if ( mealTime.isBetween(startTime, endTime)) {
        meals.push(meal);
      }
    }
    if ( meals.length === 0 ) {
      return ServiceResponse.error('no meals found');
    } else {
      return ServiceResponse.success(meals, EMessages.RESOURCE_FOUND);
    }
  }

  async insert(mealDetails: CreateMealDTO, userName: string): Promise<ServiceResponse> {
    const meal = new MealEntity();
    meal.title = mealDetails.title;
    meal.calorie = mealDetails.calorie;
    const d = new Date();
    meal.date =  d.getDate().toString(10) + '/' + (d.getMonth() + 1).toString() + '/' + d.getFullYear();
    meal.time =  d.getHours().toString() + ':' + (d.getMinutes() + 1).toString() + ':' + d.getSeconds().toString();
    meal.userId = await UserEntity.getUserByUserName(userName);
    return ServiceResponse.success(await meal.save());
  }

  async update(mealDetails: IUpdateMealDTO): Promise<ServiceResponse> {
    const { title, calorie } = mealDetails;
    const meal: MealEntity = await MealEntity.findOne(mealDetails.id);
    if ( !meal ) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
    }
    if (!title && !calorie) {
      return ServiceResponse.error('enter value to be updated (title / calories)');
    } else {
      if (title) {
        meal.title = title;
      }
      if (calorie) {
        meal.calorie = calorie;
      }
    }
    return ServiceResponse.success(await meal.save(), EMessages.RESOURCE_FOUND);
  }

  async delete(id: number): Promise<ServiceResponse> {
    const meal: MealEntity = await MealEntity.findOne({id});
    if (meal) {
      return ServiceResponse.success(await MealEntity.remove(meal));
    } else {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND + `no meals found with this Id : ${id}`);
    }
  }
}
