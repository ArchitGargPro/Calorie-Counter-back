import 'reflect-metadata';
import {createConnection} from 'typeorm';

createConnection(
// tslint:disable-next-line:no-console
).then().catch(error => console.log(error));
