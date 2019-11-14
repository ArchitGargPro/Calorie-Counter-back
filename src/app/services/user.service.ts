import { Injectable } from '@nestjs/common';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO, UpdateUserAccessDTO, UpdateUserPasswordDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';

@Injectable()
export class UserService {

  async findAll(): Promise<UserEntity[]> {
    return await UserEntity.find();
  }

  async findByUserName(userName: string): Promise<UserInterface> {
    return await UserEntity.findByUserName(userName);
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserInterface> {
    const user: UserEntity = await UserEntity.create(createUserDTO);
    return await UserEntity.save(user);
  }

  async updateUserPassword(updateUserPasswordDTO: UpdateUserPasswordDTO): Promise<UserInterface> {
    const user: UserEntity = await UserEntity.getUserByUserName(updateUserPasswordDTO.userName);
    user.password = updateUserPasswordDTO.password;
    return await UserEntity.save(user);
  }

  async updateUserAccess(updateUserAccessDTO: UpdateUserAccessDTO): Promise<UserInterface> {
    const user: UserEntity = await UserEntity.getUserByUserName(updateUserAccessDTO.userName);
    user.access = updateUserAccessDTO.access;
    return await UserEntity.save(user);
  }

  async removeUser(userName: string): Promise<UserInterface> {
    return await UserEntity.removeUser(userName);
  }
}
