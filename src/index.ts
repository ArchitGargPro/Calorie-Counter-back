import 'reflect-metadata';
import {createConnection} from 'typeorm';
import AccessEntity from './app/db/entities/access.entity';

createConnection()
  .then()
  // tslint:disable-next-line:no-console
  .catch(error => console.log(error));
