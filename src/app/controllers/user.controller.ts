import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';
import { AccessService } from '../services/access.service';
import EAccess from '../enums/access.enum';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService,
              private readonly accessService: AccessService) {
  }

  @Get()
  async findAll(): Promise<UserInterface[] | string> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserEntity[] = await this.userService.findAll();
      if (!user) {
        return 'no users found';
      } else {
        return user;
      }
    } else {
      return 'You don\'t have access to view the records, Please log In as MANAGER or ADMIN';
    }
  }

  @Get('/:userName')
  async findById(@Param('userName')userName: string): Promise<UserInterface | string> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(userName);
      if (!user) {
        return `user \"${userName}\" not found`;
      } else {
        return user;
      }
    } else {
      return 'You don\'t have access to view the records, Please log In as MANAGER or ADMIN';
    }
  }

  @Post('/new')
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserInterface | string> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(createUserDTO.userName);
      if (!user) {
        return await this.userService.createUser(createUserDTO);
      } else {
        return 'userName \"${userName}\" already in use, try again with a different userName';
      }
    } else {
      return 'You don\'t have access to create a record, Please log In as MANAGER or ADMIN';
    }
  }

  @Delete('/remove/:userName')
  async removeUser(@Param('userName')userName: string): Promise<UserInterface | string> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(userName);
      if (!user) {
        return `user \"${userName}\" not found`;
      } else {
        return await this.userService.removeUser(userName);
      }
    } else {
      return 'You don\'t have access to create a record, Please log In as MANAGER or ADMIN';
    }
  }

  @Put('/update')
  async updateUser(@Body() createUserDTO: CreateUserDTO): Promise<UserInterface | string> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
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
    } else {
      return 'You don\'t have access to update a record, Please log In as MANAGER or ADMIN';
    }
  }
}
