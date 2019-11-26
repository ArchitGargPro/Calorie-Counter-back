import { Injectable } from '@nestjs/common';
import { CreateUserDTO, EDefault, UpdateUserAccessDTO, UpdateUserExpectation, UpdateUserPasswordDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';

@Injectable()
export class UserService {

  async findAll(): Promise<UserEntity[]> {
    return await UserEntity.find();
  }

  async findByUserName(userName: string): Promise<UserEntity> {
    return await UserEntity.findByUserName(userName);
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const user: UserEntity = await UserEntity.create(createUserDTO);
    user.calorie = EDefault.EXPECTED_CALORIE;
    return await UserEntity.save(user);
  }

  async updateUserPassword(updateUserPasswordDTO: UpdateUserPasswordDTO): Promise<UserEntity> {
    const user: UserEntity = await UserEntity.getUserByUserName(updateUserPasswordDTO.userName);
    user.password = updateUserPasswordDTO.password;
    return await UserEntity.save(user);
  }

  async updateUserAccess(updateUserAccessDTO: UpdateUserAccessDTO): Promise<UserEntity> {
    const user: UserEntity = await UserEntity.getUserByUserName(updateUserAccessDTO.userName);
    user.access = updateUserAccessDTO.access;
    return await UserEntity.save(user);
  }

  async updateUserExpectation(updateUserExpectationDTO: UpdateUserExpectation): Promise<UserEntity> {
    const user: UserEntity = await UserEntity.getUserByUserName(updateUserExpectationDTO.userName);
    user.calorie = updateUserExpectationDTO.calorie;
    return await UserEntity.save(user);
  }

  async removeUser(userName: string): Promise<UserEntity> {
    return await UserEntity.removeUser(userName);
  }
}
