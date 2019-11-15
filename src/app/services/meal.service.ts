import { Injectable } from '@nestjs/common';
import MealEntity from '../db/entities/meal.entity';
import { CreateMealDTO } from '../schema/meal.schema';

@Injectable()
export class MealService {

  async getAll(): Promise<MealEntity[] | string> {
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

  async insert(mealDetails: CreateMealDTO): Promise<MealEntity> {
    const meal = new MealEntity();
    meal.title = mealDetails.title;
    meal.calorie = mealDetails.calorie;
    // TODO change format
    const d = new Date();
    meal.date =  d.getDate().toString(10) + '/' + d.getMonth().toString() + '/' + d.getFullYear();
    meal.time =  d.getHours().toString() + ':' + d.getMinutes().toString() + ':' + d.getSeconds().toString();
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
