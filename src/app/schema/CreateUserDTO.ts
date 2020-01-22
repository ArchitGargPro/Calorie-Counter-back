import { IsEmail, IsNotEmpty } from 'class-validator';

class CreateUserDTO {

  @IsNotEmpty()
  name: string;

  @IsEmail()
  userName: string;

  @IsNotEmpty()
  password: string;

  access?: number;
  calorie?: number;
}

enum EDefault {
  EXPECTED_CALORIE = 2000,
}

export {
  CreateUserDTO,
  EDefault,
};
