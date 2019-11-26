import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../utils/ServiceResponse';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import { GetUser } from '../utils/getUser.decorator';
import EMessages from '../enums/EMessages';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async findAll(): Promise<ServiceResponse> {
    const user: UserEntity[] = await this.userService.findAll();
    if (user.length === 0) {
      return ServiceResponse.error('no users found');
    } else {
      return ServiceResponse.success(user, EMessages.RESOURCE_FOUND);
    }
  }

  @Get('/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async findById(@Param('userName')userName: string): Promise<ServiceResponse> {
    const user: UserEntity = await this.userService.findByUserName(userName);
    if (!user) {
      return ServiceResponse.error(`user \"${userName}\" not found`);
    } else {
      return ServiceResponse.success(user);
    }
  }

  @Post('/new')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async createUser(@Body() createUserDTO: CreateUserDTO, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
    const user: UserEntity = await this.userService.findByUserName(createUserDTO.userName);
    if (!user) {
      if (!createUserDTO.password) {
        return ServiceResponse.error('Enter Password & Please try again');
      } else {
        if (thisUser.access === EAccess.MANAGER) {
          createUserDTO.access = EAccess.USER;
        } else if (!createUserDTO.access) {
          createUserDTO.access = EAccess.USER;
        }
        return ServiceResponse.success(await this.userService.createUser(createUserDTO));
      }
    } else {
      return ServiceResponse.error(`userName \"${createUserDTO.userName}\" already in use`);
    }
  }

  @Delete('/remove/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async removeUser(@Param('userName')userName: string, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
    const user: UserEntity = await this.userService.findByUserName(userName);
    if (!user) {
      return ServiceResponse.error(`user not found : ${userName}`);
    }
    if ( (thisUser.access === EAccess.MANAGER && user.access === EAccess.USER) || thisUser.access === EAccess.ADMIN ) {
      return ServiceResponse.success(await this.userService.removeUser(userName));
    } else {
      return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
    }
  }

  @Put('/update')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.MANAGER, EAccess.ADMIN]))
  async updateUser(@Body() updateUserDTO: UpdateUserDTO, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
    if (!thisUser) {
      return ServiceResponse.error('Please LOG IN to perform an action');
    }
    const user: UserEntity = await this.userService.findByUserName(updateUserDTO.userName);
    if (!user) {
      return ServiceResponse.error(EMessages.RESOURCE_NOT_FOUND + `: user \"${updateUserDTO.userName}\" not found`);
    }
    if ( thisUser.access === EAccess.USER ) {
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
        updateUserDTO.userName = thisUser.userName;
        return ServiceResponse.success(await this.userService.updateUserExpectation({
          userName: updateUserDTO.userName,
          calorie: updateUserDTO.calorie,
        }));
      }
    } else if (thisUser.access === EAccess.MANAGER || thisUser.access === EAccess.ADMIN) {
      if (!updateUserDTO.calorie) {
        if (!updateUserDTO.access) {
          if (!updateUserDTO.password) {
            return ServiceResponse.error('WrongAction: Enter the value to be updated');
          } else {
            if ( thisUser === user ||
              (thisUser.access === EAccess.MANAGER && user.access !== EAccess.ADMIN) ||
              thisUser.access === EAccess.ADMIN ) {
              return ServiceResponse.success(await this.userService.updateUserPassword({
                password: updateUserDTO.password,
                userName: updateUserDTO.userName,
              }));
            } else {
              return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
            }
          }
        } else if (!updateUserDTO.password) {
          if (thisUser.access === EAccess.MANAGER && user.access === EAccess.USER && updateUserDTO.access === EAccess.MANAGER
            || thisUser.access === EAccess.ADMIN ) {
            return ServiceResponse.success(await this.userService.updateUserAccess({
              access: updateUserDTO.access,
              userName: updateUserDTO.userName,
            }));
          } else {
            return ServiceResponse.error(EMessages.UNAUTHORIZED_REQUEST);
          }
        } else {
          return ServiceResponse.error('Only one value can be updated at a time');
        }
      } else {
        if ( thisUser.access === EAccess.ADMIN ) {
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
  }
}
