import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO, UpdateUserDTO } from '../schema/user.schema';
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
        if (!createUserDTO.access || !createUserDTO.password) {
          return 'details missing, Please try again';
        } else {
          return await this.userService.createUser(createUserDTO);
        }
      } else {
        return `userName \"${createUserDTO.userName}\" already in use, try again with a different userName`;
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
  async updateUser(@Body() updateUserDTO: UpdateUserDTO): Promise<UserInterface | string> {
    if (await this.accessService.getAccess() === EAccess.USER ) {
      if ( !updateUserDTO.calorie ) {
        if ( updateUserDTO.password || updateUserDTO.access ) {
          return 'ask your MANAGER to update your password/access';
        } else {
          return 'enter the expected \'calories\' to update';
        }
      } else {
        // if ( updateUserDTO.password || updateUserDTO.access ) {
        //   return 'You cannot update password/access Ask MANAGER or ADMIN to do so';
        // }
        updateUserDTO.userName = await this.accessService.getCurrentUser();
        return await this.userService.updateUserExpectation({
          userName: updateUserDTO.userName,
          calorie: updateUserDTO.calorie,
        });
      }
    } else if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(updateUserDTO.userName);
      if (!user) {
        return `user \"${updateUserDTO.userName}\" not found`;
      } else {
        if (!updateUserDTO.calorie) {
          if (!updateUserDTO.access && !updateUserDTO.calorie) {
            if (!updateUserDTO.password) {
              return 'WrongAction: Enter the value to be updated';
            } else {
              return await this.userService.updateUserPassword({
                password: updateUserDTO.password,
                userName: updateUserDTO.userName,
              });
            }
          } else if (!updateUserDTO.password && !updateUserDTO.calorie) {
            return await this.userService.updateUserAccess({
              access: updateUserDTO.access,
              userName: updateUserDTO.userName,
            });
          } else if (updateUserDTO.calorie && !updateUserDTO.password && !updateUserDTO.access) {
            return 'You do not have access to update ExpectedCalorie of a user';
          } else {
            return 'Only one value can be updated at a time';
          }
        } else {
          if ( await this.accessService.getAccess() === EAccess.ADMIN ) {
            if (updateUserDTO.password || updateUserDTO.access) {
              return 'Only one value can be updated at a time';
            } else {
              return await this.userService.updateUserExpectation({
                userName: updateUserDTO.userName,
                calorie: updateUserDTO.calorie,
              });
            }
          }
        }
      }
    } else {
      return 'You don\'t have access to update a record, Please LOG IN';
    }
  }
}
