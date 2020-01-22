import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../schema/CreateUserDTO';
import EAccess from '../enums/access.enum';
import ServiceResponse from '../utils/ServiceResponse';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import { AuthDetails } from '../utils/AuthDetails.decorator';
import LoginDTO from '../schema/LoginDTO';
import AuthDetail from '../interfaces/AuthDetails';
import { UpdateUserDTO } from '../schema/UpdateUserDTO';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { loginValidationSchema, newUserValidationSchema, updateUserValidationSchema } from '../schema/ValidationSchemaUser';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(loginValidationSchema))
  async login(@Body() loginCredentials: LoginDTO): Promise<ServiceResponse> {
    return await this.userService.login(loginCredentials);
  }

  @Get()
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async findAll(@Query('page') page: number = 0, @Query('limit') limit: number = 10): Promise<ServiceResponse> {
    limit = limit > 100 ? 100 : limit;
    return await this.userService.findAll({page, limit});
  }

  @Get('/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.MANAGER, EAccess.ADMIN]))
  async findById(@Param('userName')userName: string, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    if (authDetail.currentUser.access === EAccess.USER) {
      userName = authDetail.currentUser.userName;
    }
    return await this.userService.findByUserName(userName);
  }

  @Post('/new')
  @UsePipes(new JoiValidationPipe(newUserValidationSchema))
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async createUser(@Body() createUserDTO: CreateUserDTO, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    return await this.userService.createUser(createUserDTO, authDetail.currentUser);
  }

  @Post('/signUp')
  @UsePipes(new JoiValidationPipe(newUserValidationSchema))
  async createAccount(@Body() createUserDTO: CreateUserDTO): Promise<ServiceResponse> {
    return await this.userService.createUser(createUserDTO, {access: 0});
  }

  @Delete('/remove/:userName')
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
  async removeUser(@Param('userName') userName: string, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    return await this.userService.removeUser(userName, authDetail.currentUser);
  }

  @Put('/update')
  @UsePipes(new JoiValidationPipe(updateUserValidationSchema))
  @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.MANAGER, EAccess.ADMIN]))
  async updateUser(@Body() updateUserDTO: UpdateUserDTO, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    return await this.userService.updateUser(updateUserDTO, authDetail.currentUser);
  }
}
