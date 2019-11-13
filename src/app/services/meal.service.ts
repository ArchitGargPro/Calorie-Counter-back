import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealEntity } from '../db/entities/meal.entity';
import { Repository } from 'typeorm';
import MealInterface from '../interfaces/meal.interface';

@Injectable()
export class MealService {

  findAll(UID: string): Promise<MealInterface[]> {
    return MealEntity.find();
  }
}
