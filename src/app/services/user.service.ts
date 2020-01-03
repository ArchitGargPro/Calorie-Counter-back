import { Injectable } from '@nestjs/common';
import { CreateUserDTO, EDefault, UpdateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';
import ServiceResponse from '../utils/ServiceResponse';
import EMessages from '../enums/EMessages';
import EAccess from '../enums/access.enum';
import LoginDTO from '../schema/access.schema';
import AuthService from './auth.service';
import * as bcrypt from 'bcryptjs';

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
          user.password = updateUserDTO.password;
        } else if (updateUserDTO.calorie) {
          user.calorie = updateUserDTO.calorie;
        }
        return ServiceResponse.success(await UserEntity.save(user));
      }
    } else if ( thisUser.access === EAccess.MANAGER ) { // MANAGER
      if (!updateUserDTO.calorie && !updateUserDTO.password && !updateUserDTO.access) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        if (updateUserDTO.password && (user.access === EAccess.USER || user === thisUser)) {
          user.password = updateUserDTO.password;
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
      if ( !updateUserDTO.calorie && !updateUserDTO.password && !updateUserDTO.access) {
        return ServiceResponse.error(EMessages.BAD_REQUEST);
      } else {
        if (  updateUserDTO.password ) {
          user.password = updateUserDTO.password;
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

  async removeUser(userName: string, access): Promise<ServiceResponse> {
    const user: UserEntity = await UserEntity.findByUserName(userName);
    if (!user) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND + ` : user not found : ${userName}`);
    }
    if ( (access === EAccess.MANAGER && user.access === EAccess.USER) || access === EAccess.ADMIN ) {
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
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (isAuthenticated) {
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
