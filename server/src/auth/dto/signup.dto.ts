import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class signupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
