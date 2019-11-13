import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';

@Injectable()
export class UserService {

  async findAll(): Promise<UserEntity[]> {
    return await UserEntity.find();
    // return user;
  }

  async findByUId(UID: string): Promise<UserInterface> {
    return await UserEntity.findById(UID);
    // if (user) {
    //   return user;
    // } else {
    //   return 'User not found';
    // }
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserInterface> {
    const user: UserEntity = await UserEntity.create(createUserDTO);
    return await UserEntity.save(user);
  }
}
