import { Injectable } from '@nestjs/common';
import { CreateUserDTO, EDefault, UpdateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';
import ServiceResponse from '../utils/ServiceResponse';
import EMessages from '../enums/EMessages';
import EAccess from '../enums/access.enum';
import LoginDTO from '../schema/access.schema';
import AuthService from './auth.service';
import * as bcryprt from 'bcryptjs';
import MealEntity from '../db/entities/meal.entity';
import IUser from '../interfaces/IUser';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getRepository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(private readonly authService: AuthService) {}

  async findAll(options: IPaginationOptions): Promise<ServiceResponse> {
    const queryBuilder = getRepository(UserEntity).createQueryBuilder('user').select(['user.id', 'user.userName', 'user.name', 'user.access', 'user.calorie']);
    const data = await paginate<IUser>(queryBuilder, options);
    if (data.items.length === 0) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
    }
    return ServiceResponse.success(data, EMessages.RESOURCE_FOUND);
  }

  async findByUserName(userName: string): Promise<ServiceResponse> {
    const user: UserEntity = await UserEntity.findByUserName(userName);
    if (!user) {
      return ServiceResponse.error(`user \"${userName}\" not found`);
    }
    const data: IUser = UserService.filter(user);
    return ServiceResponse.success(data, EMessages.RESOURCE_FOUND);
  }

  async createUser(createUserDTO: CreateUserDTO, thisUser): Promise<ServiceResponse> {
    const user: UserEntity = await UserEntity.findByUserName(createUserDTO.userName);
    if (!user) {
      if (!createUserDTO.password) {
        return ServiceResponse.error(EMessages.INVALID_CREDENTIALS);
      } else {
        // if (!thisUser) {
        //   createUserDTO.access = EAccess.USER;
        // } else
        if (thisUser.access === EAccess.MANAGER || thisUser.access === EAccess.ANONYMOUS || !createUserDTO.access) {
          createUserDTO.access = EAccess.USER;
        }
        const newU: UserEntity = await UserEntity.create(createUserDTO);
        newU.calorie = EDefault.EXPECTED_CALORIE;
        const data: IUser = UserService.filter(await UserEntity.save(newU));
        return ServiceResponse.success(data);
      }
    } else {
      return ServiceResponse.error(EMessages.INVALID_CREDENTIALS + ` : userName \"${createUserDTO.userName}\" already in use`);
    }
  }

  async updateUser(updateUserDTO: UpdateUserDTO, thisUser: UserEntity): Promise<ServiceResponse> {
    const user: UserEntity = await UserEntity.findByUserName(updateUserDTO.userName);
    if (!user) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND + `: user \"${updateUserDTO.userName}\" not found`);
    }
    if ( thisUser.access === EAccess.USER ) { // USER
      if ( !updateUserDTO.calorie && !updateUserDTO.password && !updateUserDTO.name) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        updateUserDTO.userName = thisUser.userName;
        if ( updateUserDTO.password ) {
          user.password = bcryprt.hashSync(updateUserDTO.password, 10);
        }
        if (updateUserDTO.calorie) {
          user.calorie = updateUserDTO.calorie;
        }
        if (updateUserDTO.name) {
          user.name = updateUserDTO.name;
        }
        const data: IUser = UserService.filter(await UserEntity.save(user));
        return ServiceResponse.success(data);
      }
    } else if ( thisUser.access === EAccess.MANAGER ) { // MANAGER
      if (!updateUserDTO.calorie
        && (!updateUserDTO.password || updateUserDTO.password === user.password)
        && !updateUserDTO.access
        && !updateUserDTO.name) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        if (updateUserDTO.password
          && updateUserDTO.password !== user.password
          && (user.access === EAccess.USER && user.userName !== thisUser.userName)) {
          user.password = bcryprt.hashSync(updateUserDTO.password, 10);
        } else {
          return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
        }
        if (updateUserDTO.calorie && user.access === EAccess.USER) {
          user.calorie = updateUserDTO.calorie;
        } else {
          return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
        }
        if (updateUserDTO.name && user.access === EAccess.USER) {
          user.name = updateUserDTO.name;
        } else {
          return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
        }
        if (updateUserDTO.access === EAccess.MANAGER && user.access === EAccess.USER) {
          user.access = updateUserDTO.access;
        } else {
          return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
        }
        const data: IUser = UserService.filter(await UserEntity.save(user));
        return ServiceResponse.success(data);
      }
    } else { // ADMIN
      if ( !updateUserDTO.calorie
        && (!updateUserDTO.password || updateUserDTO.password === user.password)
        && !updateUserDTO.access
      && !updateUserDTO.name) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        if (  updateUserDTO.password && updateUserDTO.password !== user.password) {
          user.password = bcryprt.hashSync(updateUserDTO.password, 10);
        }
        if ( updateUserDTO.calorie ) {
          user.calorie = updateUserDTO.calorie;
        }
        if ( updateUserDTO.name ) {
          user.name = updateUserDTO.name;
        }
        if ( updateUserDTO.access && user.userName !== thisUser.userName) {
          user.access = updateUserDTO.access;
        }
        const data: IUser = UserService.filter(await UserEntity.save(user));
        return ServiceResponse.success(data);
      }
    }
  }

  async removeUser(userName: string, thisUser: UserEntity): Promise<ServiceResponse> {
    const user: UserEntity = await UserEntity.findByUserName(userName);
    const meals: MealEntity[] = await MealEntity.findByUser(user);
    if (!user) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND + ` : user not found : ${userName}`);
    }
    // manager can delete user || admin can delete anyone except himself
    if ( (thisUser.access === EAccess.MANAGER && user.access === EAccess.USER)
      || (thisUser.access === EAccess.ADMIN && userName !== thisUser.userName)) {
      await MealEntity.remove(meals);
      const data: IUser = UserService.filter(await UserEntity.removeUser(userName));
      return ServiceResponse.success(data);
    } else {
      return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
    }
  }

  async login(loginCredentials: LoginDTO): Promise<ServiceResponse> {
    const {userName, password} = loginCredentials;
    const user: UserEntity = await UserEntity.findByUserName(userName);
    if ( !user ) {
      return ServiceResponse.error(EMessages.INVALID_CREDENTIALS);
    }
    const data: IUser = UserService.filter(await UserEntity.findByUserName(userName));
    if (await bcryprt.compare(password, user.password)) {
      return ServiceResponse.success(
        {
          jwttoken: await this.authService.generateJWTToken(user),
          user: data,
        }, 'Logged in Successfully');
    } else {
      return ServiceResponse.error(EMessages.INVALID_CREDENTIALS);
    }
  }

  // to remove password from an array of UserEntity
  private filterArray(userEntity: UserEntity[]): IUser[] {
    return userEntity.map((user: UserEntity): IUser => {
      delete user.password;
      return user;
    });
  }

  private static filter(user: UserEntity): IUser {
    delete user.password;
    return user;
  }
}
