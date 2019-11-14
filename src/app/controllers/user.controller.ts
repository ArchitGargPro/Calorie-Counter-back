import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import UserInterface from '../interfaces/user.interface';
import { CreateUserDTO } from '../schema/user.schema';
import UserEntity from '../db/entities/user.entity';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  async findAll(): Promise<UserInterface[] | string> {
    console.log('finding all ...');
    const user: UserEntity[] = await this.userService.findAll();
    if (!user) {
      return 'no users found';
    } else {
      return user;
    }
  }

  @Post('/new')
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserInterface> {
    return await this.userService.createUser(createUserDTO);
  }
}
