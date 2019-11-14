import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO, UpdateUserAccessDTO, UpdateUserPasswordDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  async findAll(): Promise<UserInterface[] | string> {
    const user: UserEntity[] = await this.userService.findAll();
    if (!user) {
      return 'no users found';
    } else {
      return user;
    }
  }

  @Get('/:userName')
  async findById(@Param('userName')userName: string): Promise<UserInterface | string> {
    const user: UserInterface = await this.userService.findByUserName(userName);
    if (!user) {
      return `user \"${userName}\" not found`;
    } else {
      return user;
    }
  }

  @Post('/new')
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserInterface | string> {
    const user: UserInterface = await this.userService.findByUserName(createUserDTO.userName);
    if (!user) {
      return await this.userService.createUser(createUserDTO);
    } else {
      return 'userName \"${userName}\" already in use, try again with a different userName';
    }
  }

  @Delete('/remove/:userName')
  async removeUser(@Param('userName')userName: string): Promise<UserInterface | string> {
    const user: UserInterface = await this.userService.findByUserName(userName);
    if (!user) {
      return `user \"${userName}\" not found`;
    } else {
      return await this.userService.removeUser(userName);
    }
  }

  @Put('/update')
  async updateUser(@Body() createUserDTO: CreateUserDTO): Promise<UserInterface | string> {
    const user: UserInterface = await this.userService.findByUserName(createUserDTO.userName);
    if (!user) {
      return `user \"${createUserDTO.userName}\" not found`;
    } else {
      if (createUserDTO.access === undefined) {
        if (createUserDTO.password === undefined) {
          return 'WrongAction: Enter the value to be updated';
        } else {
          return await this.userService.updateUserPassword({
            password: createUserDTO.password,
            userName: createUserDTO.userName,
          });
        }
      } else if (createUserDTO.password === undefined) {
        return await this.userService.updateUserAccess({
          access: createUserDTO.access,
          userName: createUserDTO.userName,
        });
      } else {
        return 'Only one value can be updated at a time';
      }
    }
  }
}
