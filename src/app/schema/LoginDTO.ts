import { IsEmail, IsNotEmpty } from 'class-validator';

class LoginDTO {
  @IsEmail()
  userName: string;

  @IsNotEmpty()
  password: string;
}
export default LoginDTO;
