import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';
import Joi from 'joi';

export class createPostDto {
  @IsString({ message: 'Title must be type of string' })
  @IsNotEmpty({ message: 'title field cannot be empty' })
  @MaxLength(100, { message: 'Title cannot be more than 100 characters' })
  title: string;

  @IsString({ message: 'Body must be type of string' })
  @IsNotEmpty({ message: 'body field cannot be empty' })
  body: string;

  @IsUUID()
  @IsNotEmpty({ message: 'classroom_id field cannot be empty' })
  classroom_id: number;
}

export const createPostSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  classroom_Id: Joi.number().required(),
});

export class updatePostDto {
  @IsString({ message: 'Title must be type of string' })
  @IsNotEmpty({ message: 'title field cannot be empty' })
  @MaxLength(100, { message: 'Title cannot be more than 100 characters' })
  title: string;

  @IsString({ message: 'Body must be type of string' })
  @IsNotEmpty({ message: 'body field cannot be empty' })
  body: string;
}

export const updatePostSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});
