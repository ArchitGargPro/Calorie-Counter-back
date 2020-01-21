import { Injectable } from '@nestjs/common';
import MealEntity from '../db/entities/meal.entity';
import { CreateMealDTO, IFilters, IPerDay, IUpdateMealDTO } from '../schema/meal.schema';
import UserEntity from '../db/entities/user.entity';
import EMessages from '../enums/EMessages';
import ServiceResponse from '../utils/ServiceResponse';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Between, getRepository, Like } from 'typeorm';
import EAccess from '../enums/access.enum';
import moment = require('moment-timezone');
import IMeal from '../interfaces/IMeal';

@Injectable()
export class MealService {

  async getMeals( filters: IFilters, thisUser: UserEntity, options: IPaginationOptions): Promise<ServiceResponse> {
    if (filters.id) {
      const meal: MealEntity[] = await MealEntity.find({
        select: ['id', 'date', 'time', 'title', 'calorie'],
        where: {
          id: filters.id,
        },
      });
      if (meal.length === 0) {
        return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
      }
      const mealUser: MealEntity[] = await MealEntity.find({
        where: {
          id: filters.id,
        },
      });
      if (mealUser[0].userId.userName === thisUser.userName || thisUser.access === EAccess.ADMIN) {
        return this.addOverflow(meal);
      } else {
        return ServiceResponse.error(EMessages.PERMISSION_DENIED);
      }
    }
    if (thisUser.access === EAccess.USER) {
      filters.userName = thisUser.userName;
    }
    let fromDate = new Date();
    let toDate = new Date();
    if (filters.fromDate) {
      fromDate = moment(filters.fromDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
      if (!moment(filters.fromDate, 'DD/MM/YYYY').isValid()) {
        return ServiceResponse.error(EMessages.INVALID_INPUT);
      }
      if (filters.toDate) {
        toDate = moment(filters.toDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
        if (!moment(filters.toDate, 'DD/MM/YYYY').isValid()) {
          return ServiceResponse.error(EMessages.INVALID_INPUT);
        }
      } else {
        return ServiceResponse.error(EMessages.INVALID_INPUT);
      }
    }

    let fromTime;
    let toTime;
    if (filters.fromTime) {
      fromTime = moment(filters.fromTime, 'hh:mm').format('HH:mm');
      if (!moment(filters.fromTime, 'hh:mm').isValid()) {
        return ServiceResponse.error(EMessages.INVALID_INPUT);
      }
      if (filters.toTime) {
        toTime = moment(filters.toTime, 'hh:mm').format('HH:mm');
        if (!moment(filters.toTime, 'hh:mm').isValid()) {
          return ServiceResponse.error(EMessages.INVALID_INPUT);
        }
      } else {
        return ServiceResponse.error(EMessages.INVALID_INPUT);
      }
    }
    if (!filters.title) {
      filters.title = '';
    }
    if (filters.fromCalorie) {
      filters.fromCalorie = filters.fromCalorie.valueOf();
    }
    if (filters.toCalorie) {
      filters.toCalorie = filters.toCalorie.valueOf();
    }
    let userId: UserEntity;
    if (filters.userName) {
      userId = await UserEntity.findByUserName(filters.userName);
      if (!userId) {
        return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
      }
    }
    const findOptions = {
      select: ['id', 'date', 'time', 'title', 'calorie'],
      where: {
        userId: {...userId},
        calorie: Between(filters.fromCalorie, filters.toCalorie),
        date: Between(fromDate, toDate),
        time: Between(fromTime, toTime),
        title: Like('%' + filters.title + '%'),
      },
      orderBy: 'time',
      groupBy: 'date',
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    };
    if (!filters.userName) {
      delete findOptions.where.userId;
    }
    if (!filters.fromTime || !filters.toTime) {
      delete findOptions.where.time;
    }
    if (!filters.fromDate || !filters.toDate) {
      delete findOptions.where.date;
    }
    if (!filters.fromCalorie || !filters.toCalorie) {
      delete findOptions.where.calorie;
    }
    const meals = await MealEntity.find(findOptions as any);
    return this.addOverflow(meals);
  }

  async addOverflow(meals) {
    const dates = meals.map(meal => {
      return meal.date;
    });
    const caloriesPerDay: IPerDay[] = await getRepository(MealEntity)
      .createQueryBuilder('meal')
      .select('meal.date, SUM(meal.calorie) AS sum')
      .groupBy('meal.date')
      .where('meal.date IN (:...dates)', {dates})
      .getRawMany();
    const data: IMeal[] = meals.map((meal) => {
      for (const perDay of caloriesPerDay) {
        if (perDay.date === meal.date) {
          return {
            id : meal.id,
            date : meal.date,
            time : meal.time,
            title : meal.title,
            calorie : meal.calorie,
            sum : perDay.sum,
          };
        }
      }
    });
    return ServiceResponse.success(data, EMessages.RESOURCE_FOUND);
  }

  async insert(mealDetails: CreateMealDTO, userName: string, currentUserAccess: number): Promise<ServiceResponse> {
    const meal = new MealEntity();
    if (!mealDetails.title || !mealDetails.calorie || (currentUserAccess === EAccess.ADMIN && !mealDetails.userName)) {
      return ServiceResponse.error(EMessages.INVALID_INPUT);
    }
    meal.title = mealDetails.title;
    meal.calorie = mealDetails.calorie;
    let d = moment(new Date(), 'DD/MM/YYYY').format('YYYY/MM/DD');
    if (mealDetails.date) {
      meal.date = moment(mealDetails.date, 'DD/MM/YYYY').format('YYYY/MM/DD');
      if (!moment(mealDetails.date, 'DD/MM/YYYY').isValid()) {
        return ServiceResponse.error(EMessages.INVALID_INPUT);
      }
    } else {
      meal.date = d;
    }
    d = moment(new Date(), 'hh:mm').format('hh:mm');
    if (mealDetails.time) {
      meal.time = moment(mealDetails.time, 'hh:mm').format('HH:mm');
      if (!moment(mealDetails.time, 'hh:mm').isValid()) {
        return ServiceResponse.error(EMessages.INVALID_INPUT);
      }
    } else {
      meal.time = d.toString();
    }
    meal.userId = await UserEntity.getUserByUserName(userName);
    await meal.save();
    return ServiceResponse.success('', EMessages.SUCCESS);
  }

  async update(mealDetails: IUpdateMealDTO): Promise<ServiceResponse> {
    const meal: MealEntity = await MealEntity.findOne(mealDetails.id);
    if ( !meal ) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
    }
    if (!mealDetails.title
      && !mealDetails.calorie
      && (!mealDetails.date || mealDetails.date === 'Invalid date')
      && (!mealDetails.time || mealDetails.time === 'Invalid date')) {
      return ServiceResponse.error('enter value to be updated (title/calories/date/time)');
    } else {
      if (mealDetails.title) {
        meal.title = mealDetails.title;
      }
      if (mealDetails.calorie) {
        meal.calorie = mealDetails.calorie;
      }
      if (mealDetails.date && !(mealDetails.date === 'Invalid date')) {
        meal.date = moment(mealDetails.date).format('YYYY/MM/DD');
        if (!moment(mealDetails.date, 'YYYY/MM/DD').isValid()) {
          return ServiceResponse.error(EMessages.INVALID_INPUT);
        }
      }
      if (mealDetails.time && !(mealDetails.time === 'Invalid date')) {
        meal.time = moment(mealDetails.time, 'hh:mm').format('HH:mm');
        if (!moment(mealDetails.time, 'hh:mm').isValid()) {
          return ServiceResponse.error(EMessages.INVALID_INPUT);
        }
      }
    }
    await meal.save();
    return ServiceResponse.success('', EMessages.SUCCESS);
  }

  async delete(id: number): Promise<ServiceResponse> {
    const meal: MealEntity = await MealEntity.findOne({id});
    if (meal) {
      await MealEntity.remove(meal);
      return ServiceResponse.success('', EMessages.SUCCESS);
    } else {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND + `no meals found with this Id : ${id}`);
    }
  }
}
