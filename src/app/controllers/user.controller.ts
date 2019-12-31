import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../utils/ServiceResponse';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import { GetUser } from '../utils/getUser.decorator';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async findAll(): Promise<ServiceResponse> {
    return await this.userService.findAll();
  }

  @Get('/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async findById(@Param('userName')userName: string): Promise<ServiceResponse> {
    return await this.userService.findByUserName(userName);
  }

  @Post('/new')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.ANONYMOUS, EAccess.MANAGER, EAccess.ADMIN]))
  async createUser(@Body() createUserDTO: CreateUserDTO, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
    return await this.userService.createUser(createUserDTO, thisUser.access);
  }

  @Delete('/remove/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async removeUser(@Param('userName')userName: string, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
    return await this.userService.removeUser(userName, thisUser.access);
  }

  @Put('/update')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.MANAGER, EAccess.ADMIN]))
  async updateUser(@Body() updateUserDTO: UpdateUserDTO, @GetUser() thisUser: UserEntity): Promise<ServiceResponse> {
    return await this.userService.updateUser(updateUserDTO, thisUser);
  }
}
