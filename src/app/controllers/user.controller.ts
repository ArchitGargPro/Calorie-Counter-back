import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO } from '../schema/user.schema';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/view')
  findAll(): Promise<UserInterface[]> {
    return this.userService.findAll();
  }

  @Post('/new')
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserInterface> {
    return this.userService.createUser(createUserDTO);
  }
}
