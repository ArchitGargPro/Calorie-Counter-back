import { Injectable } from '@nestjs/common';
import MealEntity from '../db/entities/meal.entity';
import { CreateMealDTO, IFilters, IUpdateMealDTO } from '../schema/meal.schema';
import UserEntity from '../db/entities/user.entity';
import EMessages from '../enums/EMessages';
import ServiceResponse from '../utils/ServiceResponse';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getRepository } from 'typeorm';
import EAccess from '../enums/access.enum';

@Injectable()
export class MealService {

  // async getMeal(userName: string, options: IPaginationOptions): Promise<ServiceResponse> {
  //   const userEntity: UserEntity = await UserEntity.findByUserName(userName);
  //   if ( !userEntity ) {
  //     return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
  //   } else {
  //     const queryBuilder = getRepository(MealEntity).createQueryBuilder('meal').where('meal.userId = :user', {user: userEntity});
  //     const data = await paginate<MealEntity>(queryBuilder, options);
  //     if (data.items.length === 0) {
  //       return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
  //     }
  //     return ServiceResponse.success(data, EMessages.RESOURCE_FOUND);
  //   }
  // }

  async getMeals( filters: IFilters, thisUser: UserEntity, options: IPaginationOptions): Promise<ServiceResponse> {
    if (thisUser.access === EAccess.USER) {
      filters.userName = thisUser.userName;
    }
    const queryBuilder = getRepository(MealEntity).createQueryBuilder('meal');
    if (filters.userName) {
      const userEntity: UserEntity = await UserEntity.findByUserName(filters.userName);
      if ( !userEntity ) {
        return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
      } else {
        queryBuilder.andWhere('meal.userId = :user', {user: userEntity});
      }
    }
    if (filters.fromCalorie) {
      if (!filters.toCalorie || filters.toCalorie < filters.fromCalorie) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      }
      queryBuilder.andWhere('meal.calorie BETWEEN :fromCalorie AND :toCalorie',
        {fromCalorie: filters.fromCalorie, toCalorie: filters.toCalorie});
    }
    if (filters.fromDate) {
      if (!filters.toDate || filters.toDate < filters.fromDate) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      }
      queryBuilder.andWhere('meal.date BETWEEN :fromDate AND :toDate',
        {fromDate: filters.fromDate, toDate: filters.toDate});
    }
    if (filters.fromTime) {
      if (!filters.toTime || filters.toTime < filters.fromTime) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      }
      queryBuilder.andWhere('meal.time BETWEEN :fromTime AND :toTime',
        {fromTime: filters.fromTime, toTime: filters.toTime});
    }
    if (filters.title) {
      filters.title = '%' + filters.title + '%';
      queryBuilder.andWhere('meal.title LIKE :title', {title: filters.title});
    }
    const data = await paginate<MealEntity>(queryBuilder, options);
    if (data.items.length === 0) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
    }
    return ServiceResponse.success(data, EMessages.RESOURCE_FOUND);
  }

// async getMealByDate( dates: IDates): Promise<ServiceResponse> {
//   const startDate = moment(dates.fromDate , 'DD/MM/YYYY');
//   const endDate = moment(dates.toDate , 'DD/MM/YYYY');
//   const allMeals: MealEntity[] = await MealEntity.findByUser(await UserEntity.getUserByUserName(dates.userName));
//   const meals: MealEntity[] = [];
//   for (const meal of allMeals) {
//     const mealDate = moment( meal.date, 'DD/MM/YYYY');
//     if ( mealDate.isBetween(startDate, endDate)) {
//       meals.push(meal);
//     }
//   }
//   if ( meals.length === 0 ) {
//     return ServiceResponse.error('no meals found');
//   } else {
//     return ServiceResponse.success(meals, EMessages.RESOURCE_FOUND);
//   }
// }

// async getMealByTime( time: ITime): Promise<ServiceResponse> {
//   const startTime = moment(time.fromTime , 'HH:mm:ss');
//   const endTime = moment(time.toTime , 'HH:mm:ss');
//   const allMeals: MealEntity[] = await MealEntity.findByUser(await UserEntity.getUserByUserName(time.userName));
//   const meals: MealEntity[] = [];
//   for ( const meal of allMeals) {
//     const mealTime = moment( meal.time, 'HH:mm:ss');
//     if ( mealTime.isBetween(startTime, endTime)) {
//       meals.push(meal);
//     }
//   }
//   if ( meals.length === 0 ) {
//     return ServiceResponse.error('no meals found');
//   } else {
//     return ServiceResponse.success(meals, EMessages.RESOURCE_FOUND);
//   }
// }

  async insert(mealDetails: CreateMealDTO, userName: string): Promise<ServiceResponse> {
    const meal = new MealEntity();
    meal.title = mealDetails.title;
    meal.calorie = mealDetails.calorie;
    const d = new Date();
    if (mealDetails.date) {
      meal.date = mealDetails.date;
    } else {
      meal.date =  d.getDate().toString(10) + '/' + (d.getMonth() + 1).toString() + '/' + d.getFullYear();
    }
    if (mealDetails.time) {
      meal.time = mealDetails.time;
    } else {
      meal.time =  d.getHours().toString() + ':' + (d.getMinutes() + 1).toString() + ':' + d.getSeconds().toString();
    }
    meal.userId = await UserEntity.getUserByUserName(userName);
    return ServiceResponse.success(await meal.save());
  }

  async update(mealDetails: IUpdateMealDTO): Promise<ServiceResponse> {
    const meal: MealEntity = await MealEntity.findOne(mealDetails.id);
    if ( !meal ) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
    }
    if (!mealDetails.title && !mealDetails.calorie && !mealDetails.date && !mealDetails.time) {
      return ServiceResponse.error('enter value to be updated (title / calories)');
    } else {
      if (mealDetails.title) {
        meal.title = mealDetails.title;
      }
      if (mealDetails.calorie) {
        meal.calorie = mealDetails.calorie;
      }
      if (mealDetails.date) {
        meal.date = mealDetails.date;
      }
      if (mealDetails.time) {
        meal.time = mealDetails.time;
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
