import 'reflect-metadata';
import {createConnection} from 'typeorm';
import {UserEntity} from './app/db/entities/user.entity';
import { MealEntity } from './app/db/entities/meal.entity';

createConnection(
  // {
  //   type: 'sqlite',
  //   database: 'test',
  //   entities: [
  //     UserEntity,
  //     MealEntity,
  //   ],
  //   synchronize: true,
  //   logging: true,
  // }
).then(connection => {
  console.log('connected successfully ...\n\n==>', connection, '\n\n\n');
}).catch(error => console.log(error));
