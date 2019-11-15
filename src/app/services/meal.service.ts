import { Injectable } from '@nestjs/common';
import MealEntity from '../db/entities/meal.entity';
import { CreateMealDTO } from '../schema/meal.schema';
import * as moment from 'moment';
import { from } from 'rxjs';
@Injectable()
export class MealService {

  async getAll(): Promise<MealEntity[] | string> {
    console.log(moment());
    const meals: MealEntity[] = await MealEntity.find();
    if ( !meals ) {
      return 'no meals found';
    } else {
      return meals;
    }
  }

  async getMeal(id: number): Promise<any> {
    const meal: MealEntity = await MealEntity.findOne(id);
    if (!meal) {
      return 'meal not found';
    }
    return meal;
  }
  async getMealByDate( fromDate: string , toDate: string): Promise<MealEntity[]> {
    console.log('in services');
    const startDate = moment(fromDate , 'DD/MM/YYYY');
    const endDate = moment(toDate , 'DD/MM/YYYY');
    const allMeals: MealEntity[] = await MealEntity.find();
    const meals: MealEntity[] = [];
    for ( let i = 0; i < allMeals.length; i++) {
      console.log(allMeals[i].date);
      const mealDate = moment( allMeals[i].date, 'DD/MM/YYYY');

      if ( mealDate.isBetween(startDate, endDate)) {
        meals.push(allMeals[i]);
      }
    }
    return meals;
  }
  async getMealByTime( fromTime: string , toTime: string): Promise<MealEntity[]> {
    console.log('in services');
    const startTime = moment(fromTime , 'HH:mm:ss');
    const endTime = moment(toTime , 'HH:mm:ss');
    const allMeals: MealEntity[] = await MealEntity.find();
    const meals: MealEntity[] = [];
    for ( let i = 0; i < allMeals.length; i++) {
      console.log(allMeals[i].time);
      const mealTime = moment( allMeals[i].time, 'HH:mm:ss');

      if ( mealTime.isBetween(startTime, endTime)) {
        meals.push(allMeals[i]);
      }
    }
    return meals;
  }

  async insert(mealDetails: CreateMealDTO): Promise<MealEntity> {
    const meal = new MealEntity();
    meal.title = mealDetails.title;
    meal.calorie = mealDetails.calorie;
    // TODO change format
    const d = new Date();
    meal.date =  d.getDate().toString(10) + '/' + (d.getMonth() + 1).toString() + '/' + d.getFullYear();
    meal.time =  d.getHours().toString() + ':' + (d.getMinutes() + 1).toString() + ':' + d.getSeconds().toString();
    return await meal.save();
  }

  async update(id: number , mealDetails: CreateMealDTO): Promise<any> {
    const { title, calorie } = mealDetails;
    const meal: MealEntity = await MealEntity.findOne(id);
    if ( !meal ) {
      return `meal not found (Id : ${id})`;
    }
    if (title) {
      meal.title = title;
    }
    if (calorie) {
      meal.calorie = calorie;
    }
    return await meal.save();
  }

  async delete(id: number): Promise<any> {
    const meal: MealEntity = await MealEntity.findOne(id);
    if (meal) {
      return await MealEntity.remove(meal);
    } else {
      return `meal not found (Id : ${id})`;
    }
  }
}
