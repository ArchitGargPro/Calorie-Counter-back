import 'reflect-metadata';
import {createConnection} from 'typeorm';

createConnection()
  .then()
  // tslint:disable-next-line:no-console
  .catch(error => console.log(error));
