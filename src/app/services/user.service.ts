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

@Injectable()
export class UserService {

  constructor(private readonly authService: AuthService) {}

  async findAll(): Promise<ServiceResponse> {
    const user: UserEntity[] = await UserEntity.find();
    if (user.length === 0) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND);
    }
    return ServiceResponse.success(user, EMessages.RESOURCE_FOUND);
  }

  async findByUserName(userName: string): Promise<ServiceResponse> {
    const user: UserEntity = await UserEntity.findByUserName(userName);
    if (!user) {
      return ServiceResponse.error(`user \"${userName}\" not found`);
    }
    return ServiceResponse.success(user, EMessages.RESOURCE_FOUND);
  }

  async createUser(createUserDTO: CreateUserDTO, thisUser): Promise<ServiceResponse> {
    const user: UserEntity = await UserEntity.findByUserName(createUserDTO.userName);
    if (!user) {
      if (!createUserDTO.password) {
        return ServiceResponse.error(EMessages.INVALID_CREDENTIALS);
      } else {
        if (!thisUser) {
          createUserDTO.access = EAccess.USER;
        } else if (thisUser.access === EAccess.MANAGER || thisUser.access === EAccess.ANONYMOUS || !createUserDTO.access) {
          createUserDTO.access = EAccess.USER;
        }
        const newU: UserEntity = await UserEntity.create(createUserDTO);
        newU.calorie = EDefault.EXPECTED_CALORIE;
        return ServiceResponse.success(await UserEntity.save(newU));
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
      if ( !updateUserDTO.calorie && !updateUserDTO.password) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        updateUserDTO.userName = thisUser.userName;
        if ( updateUserDTO.password ) {
          user.password = bcryprt.hashSync(updateUserDTO.password, 10);
        } else if (updateUserDTO.calorie) {
          user.calorie = updateUserDTO.calorie;
        }
        return ServiceResponse.success(await UserEntity.save(user));
      }
    } else if ( thisUser.access === EAccess.MANAGER ) { // MANAGER
      if (!updateUserDTO.calorie
        && (!updateUserDTO.password || updateUserDTO.password === user.password)
        && !updateUserDTO.access) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        if (updateUserDTO.password && updateUserDTO.password !== user.password && (user.access === EAccess.USER || user === thisUser)) {
          user.password = bcryprt.hashSync(updateUserDTO.password, 10);
        } else {
          return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
        }
        if (updateUserDTO.calorie && user.access === EAccess.USER) {
          user.calorie = updateUserDTO.calorie;
        } else {
          return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
        }
        if (updateUserDTO.access === EAccess.MANAGER && user.access === EAccess.USER) {
          user.access = updateUserDTO.access;
        } else {
          return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
        }
        return ServiceResponse.success(await UserEntity.save(user));
      }
    } else { // ADMIN
      if ( !updateUserDTO.calorie
        && (!updateUserDTO.password || updateUserDTO.password === user.password)
        && !updateUserDTO.access) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        if (  updateUserDTO.password && updateUserDTO.password !== user.password) {
          user.password = bcryprt.hashSync(updateUserDTO.password, 10);
        }
        if ( updateUserDTO.calorie ) {
          user.calorie = updateUserDTO.calorie;
        }
        if ( updateUserDTO.access ) {
          user.access = updateUserDTO.access;
        }
        return ServiceResponse.success(await UserEntity.save(user));
      }
    }
  }

  async removeUser(userName: string, thisUser: UserEntity): Promise<ServiceResponse> {
    const access = thisUser.access;
    const user: UserEntity = await UserEntity.findByUserName(userName);
    const meals: MealEntity[] = await MealEntity.findByUser(user);
    await MealEntity.remove(meals);
    if (!user) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND + ` : user not found : ${userName}`);
    }
    if ( (access === EAccess.MANAGER && user.access === EAccess.USER) || access === EAccess.ADMIN && user !== thisUser) {
      return ServiceResponse.success(await UserEntity.removeUser(userName));
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
    if (await bcryprt.compare(password, user.password)) {
      return ServiceResponse.success(
        {
          jwttoken: await this.authService.generateJWTToken(user),
          user: await UserEntity.findByUserName(userName),
        }, 'Logged in Successfully');
    } else {
      return ServiceResponse.error(EMessages.INVALID_CREDENTIALS);
    }
  }
}
