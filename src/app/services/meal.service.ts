import { Injectable } from '@nestjs/common';
import MealEntity from '../db/entities/meal.entity';
import { CreateMealDTO } from '../schema/meal.schema';

@Injectable()
export class MealService {
  async insert(mealDetails: CreateMealDTO): Promise<MealEntity> {
    const { title, calorie } = mealDetails;
    const meal = new MealEntity();
    meal.title = title;
    meal.calorie = calorie;
    meal.date =  new Date().getDate().toString(10);
    meal.time =  new Date().getTime().toString(10);
    await meal.save();
    return meal;
  }
  async getAll(): Promise<MealEntity[]> {
    const meals: MealEntity[] = await MealEntity.find();
    return meals;
  }
  async getMeal(id: number): Promise<any> {
    const meal: MealEntity = await MealEntity.findOne(id);
    if (meal === undefined) {
      return '{ "msg" : "meal not found"}';
    }
    return meal;
  }
  async update(id: number , mealDetails: CreateMealDTO): Promise<any> {
    const { title, calorie } = mealDetails;
    const meal: MealEntity = await MealEntity.findOne(id);
    if (meal === undefined) {
      return '{ "msg" : "meal not found"}';
    }
    if (title !== undefined) {
      meal.title = title;
    }
    if (calorie !== undefined) {
      meal.calorie = calorie;
    }
    await meal.save();
    return meal;
  }
  async delete(id: number): Promise<any> {
    const meal: MealEntity = await MealEntity.findOne(id);
    if (meal !== undefined) {
      return MealEntity.remove(await MealEntity.findOne(id));
    }
    return 'meal not found';
  }
}
