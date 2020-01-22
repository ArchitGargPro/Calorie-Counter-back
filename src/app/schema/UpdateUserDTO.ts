import { IsEmail } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  userName: string;

  password?: string;
  access?: number;
  name?: string;
  calorie?: number;
}
