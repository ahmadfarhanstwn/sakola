import { IsString, IsNotEmpty, IsBoolean, IsUUID } from 'class-validator';
import { PostSetting } from '../entity/classroom.entity';
import Joi from 'joi';

export class createClassroomDto {
  @IsString({ message: 'name field need to be string' })
  @IsNotEmpty({ message: 'Name field cannot be empty' })
  name: string;

  @IsString({ message: 'description field need to be string' })
  description: string;

  @IsBoolean({ message: 'join_approval field need to be boolean' })
  join_approval: boolean;

  post_settings: PostSetting;
}

export const createClassroomSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  join_approval: Joi.boolean().required(),
  post_settings: Joi.string().valid(
    'AllPostComment',
    'StudentComment',
    'OnlyTeacher',
  ),
});

export class acceptRejectJoinDto {
  @IsUUID()
  @IsNotEmpty({ message: 'classroom_id field cannot be empty' })
  classroom_id: number;

  @IsUUID()
  @IsNotEmpty({ message: 'joining_user_id field cannot be empty' })
  joining_user_id: number;
}

export const acceptRejectJoinSchema = Joi.object({
  classroom_id: Joi.number().required(),
  joining_user_id: Joi.number().required(),
});
