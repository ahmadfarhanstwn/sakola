import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import Joi from 'joi';

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

export const signupSchema = Joi.object({
  email: Joi.string().required(),
  full_name: Joi.string().required(),
  password: Joi.string().required(),
});
