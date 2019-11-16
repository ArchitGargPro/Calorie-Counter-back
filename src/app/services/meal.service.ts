import { Injectable } from '@nestjs/common';
import MealEntity from '../db/entities/meal.entity';
import { CreateMealDTO } from '../schema/meal.schema';
import * as moment from 'moment';
import AccessEntity from '../db/entities/access.entity';
import UserEntity from '../db/entities/user.entity';

@Injectable()
export class MealService {

  async getAll(): Promise<MealEntity[] | string> {
    return this.getMeal(await AccessEntity.getCurrentUser());
  }

  async getMeal(userName: string): Promise<MealEntity[] | string> {
    const meals: MealEntity[] = await MealEntity.findByUser(await UserEntity.getUserByUserName(userName));
    if ( meals.length === 0 ) {
      return 'no meals found';
    } else {
      return meals;
    }
  }

  async getMealByDate( fromDate: string , toDate: string): Promise<MealEntity[] | string> {
    const startDate = moment(fromDate , 'DD/MM/YYYY');
    const endDate = moment(toDate , 'DD/MM/YYYY');
    const allMeals: MealEntity[] = await MealEntity.find();
    const meals: MealEntity[] = [];
    for (const meal of allMeals) {
      const mealDate = moment( meal.date, 'DD/MM/YYYY');
      if ( mealDate.isBetween(startDate, endDate)) {
        meals.push(meal);
      }
    }
    if ( meals.length === 0 ) {
      return 'no meals found';
    } else {
      return meals;
    }
  }

  async getMealByTime( fromTime: string , toTime: string): Promise<MealEntity[] | string> {
    const startTime = moment(fromTime , 'HH:mm:ss');
    const endTime = moment(toTime , 'HH:mm:ss');
    const allMeals: MealEntity[] = await MealEntity.find();
    const meals: MealEntity[] = [];
    for ( const meal of allMeals) {
      const mealTime = moment( meal.time, 'HH:mm:ss');
      if ( mealTime.isBetween(startTime, endTime)) {
        meals.push(meal);
      }
    }
    if ( meals.length === 0 ) {
      return 'no meals found';
    } else {
      return meals;
    }
  }

  async insert(mealDetails: CreateMealDTO): Promise<MealEntity> {
    const meal = new MealEntity();
    meal.title = mealDetails.title;
    meal.calorie = mealDetails.calorie;
    const d = new Date();
    meal.date =  d.getDate().toString(10) + '/' + (d.getMonth() + 1).toString() + '/' + d.getFullYear();
    meal.time =  d.getHours().toString() + ':' + (d.getMinutes() + 1).toString() + ':' + d.getSeconds().toString();
    const userName = await AccessEntity.getCurrentUser();
    meal.userId = await UserEntity.getUserByUserName(userName);
    return await meal.save();
  }

  async update(id: number , mealDetails: CreateMealDTO): Promise<MealEntity | string> {
    const { title, calorie } = mealDetails;
    const meal: MealEntity = await MealEntity.findOne(id);
    if ( !meal ) {
      return `meal not found`;
    }
    if (!title && !calorie) {
      return 'enter value to be updated (title / calories)';
    } else {
      if (title) {
        meal.title = title;
      }
      if (calorie) {
        meal.calorie = calorie;
      }
    }
    return await meal.save();
  }

  async delete(id: number): Promise<any> {
    const meal: MealEntity = await MealEntity.findOne(id);
    if (meal) {
      return await MealEntity.remove(meal);
    } else {
      return `meal not found with this Id : ${id}`;
    }
  }
}
