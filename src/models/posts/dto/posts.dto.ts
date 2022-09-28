import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

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

export class updatePostDto {
  @IsString({ message: 'Title must be type of string' })
  @IsNotEmpty({ message: 'title field cannot be empty' })
  @MaxLength(100, { message: 'Title cannot be more than 100 characters' })
  title: string;

  @IsString({ message: 'Body must be type of string' })
  @IsNotEmpty({ message: 'body field cannot be empty' })
  body: string;
}
