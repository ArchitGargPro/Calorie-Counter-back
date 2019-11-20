import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO, UpdateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';
import { AccessService } from '../services/access.service';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../services/ServiceResponse';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService,
              private readonly accessService: AccessService) {
  }

  @Get()
  async findAll(): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserEntity[] = await this.userService.findAll();
      if (!user) {
        return ServiceResponse.error('no users found');
      } else {
        return ServiceResponse.success(user);
      }
    } else {
      return ServiceResponse.error('You don\'t have access to view the records, Please log In as MANAGER or ADMIN');
    }
  }

  @Get('/:userName')
  async findById(@Param('userName')userName: string): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(userName);
      if (!user) {
        return ServiceResponse.error(`user \"${userName}\" not found`);
      } else {
        return ServiceResponse.success(user);
      }
    } else {
      return ServiceResponse.error('You don\'t have access to view the records, Please log In as MANAGER or ADMIN');
    }
  }

  @Post('/new')
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(createUserDTO.userName);
      if (!user) {
        if (!createUserDTO.access || !createUserDTO.password) {
          return ServiceResponse.error('details missing, Please try again');
        } else {
          return ServiceResponse.success(await this.userService.createUser(createUserDTO));
        }
      } else {
        return ServiceResponse.error(`userName \"${createUserDTO.userName}\" already in use, try again with a different userName`);
      }
    } else {
      return ServiceResponse.error('You don\'t have access to create a record, Please log In as MANAGER or ADMIN');
    }
  }

  @Delete('/remove/:userName')
  async removeUser(@Param('userName')userName: string): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(userName);
      if (!user) {
        return ServiceResponse.error(`user \"${userName}\" not found`);
      } else {
        return ServiceResponse.success(await this.userService.removeUser(userName));
      }
    } else {
      return ServiceResponse.error('You don\'t have access to create a record, Please log In as MANAGER or ADMIN');
    }
  }

  @Put('/update')
  async updateUser(@Body() updateUserDTO: UpdateUserDTO): Promise<ServiceResponse> {
    if (await this.accessService.getAccess() === EAccess.USER ) {
      if ( !updateUserDTO.calorie ) {
        if ( updateUserDTO.password || updateUserDTO.access ) {
          return ServiceResponse.error('ask your MANAGER to update your password/access');
        } else {
          return ServiceResponse.error('enter the expected \'calories\' to update');
        }
      } else {
        // if ( updateUserDTO.password || updateUserDTO.access ) {
        //   return 'You cannot update password/access Ask MANAGER or ADMIN to do so';
        // }
        updateUserDTO.userName = await this.accessService.getCurrentUser();
        return ServiceResponse.success(await this.userService.updateUserExpectation({
          userName: updateUserDTO.userName,
          calorie: updateUserDTO.calorie,
        }));
      }
    } else if (await this.accessService.getAccess() === EAccess.MANAGER || await this.accessService.getAccess() === EAccess.ADMIN) {
      const user: UserInterface = await this.userService.findByUserName(updateUserDTO.userName);
      if (!user) {
        return ServiceResponse.error(`user \"${updateUserDTO.userName}\" not found`);
      } else {
        if (!updateUserDTO.calorie) {
          if (!updateUserDTO.access && !updateUserDTO.calorie) {
            if (!updateUserDTO.password) {
              return ServiceResponse.error('WrongAction: Enter the value to be updated');
            } else {
              return ServiceResponse.success(await this.userService.updateUserPassword({
                password: updateUserDTO.password,
                userName: updateUserDTO.userName,
              }));
            }
          } else if (!updateUserDTO.password && !updateUserDTO.calorie) {
            return ServiceResponse.success(await this.userService.updateUserAccess({
              access: updateUserDTO.access,
              userName: updateUserDTO.userName,
            }));
          } else if (updateUserDTO.calorie && !updateUserDTO.password && !updateUserDTO.access) {
            return ServiceResponse.error('You do not have access to update ExpectedCalorie of a user');
          } else {
            return ServiceResponse.error('Only one value can be updated at a time');
          }
        } else {
          if ( await this.accessService.getAccess() === EAccess.ADMIN ) {
            if (updateUserDTO.password || updateUserDTO.access) {
              return ServiceResponse.error('Only one value can be updated at a time');
            } else {
              return ServiceResponse.success(await this.userService.updateUserExpectation({
                userName: updateUserDTO.userName,
                calorie: updateUserDTO.calorie,
              }));
            }
          }
        }
      }
    } else {
      return ServiceResponse.error('Please LOG IN to perform an action');
    }
  }
}
