import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  ClassMemberRoleEnum,
  ClassMembersEntity,
} from '../../../class_members/entity/class_members.entity';
import { DataSource } from 'typeorm';
import {
  ClassroomEntity,
  PostSetting,
} from 'src/classroom/entity/classroom.entity';
import { PostsEntity } from 'src/posts/entity/posts.entity';

@Injectable()
export class PostsService {
  constructor(private dataSource: DataSource) {}

  async isUserJoined(
    userId: number,
    classroomId: number,
  ): Promise<ClassMembersEntity> {
    return await this.dataSource
      .getRepository(ClassMembersEntity)
      .createQueryBuilder('class_members')
      .where('class_members.user_id = :id', { id: userId })
      .andWhere('class_members.classroom_id = :id', { id: classroomId })
      .getOne();
  }

  async createPost(
    userId: number,
    classroomId: number,
    title: string,
    body: string,
  ): Promise<any> {
    try {
      const user = await this.isUserJoined(userId, classroomId);
      if (!user)
        return new HttpException(
          'You are unable to create a post in this classroom',
          HttpStatus.UNAUTHORIZED,
        );

      const classroom = await this.dataSource
        .getRepository(ClassroomEntity)
        .createQueryBuilder('classroom')
        .where('classroom.id = :id', { id: classroomId })
        .getOne();
      if (
        classroom.post_setting != PostSetting.AllPostComment &&
        user.role != ClassMemberRoleEnum.Teacher
      )
        return new HttpException(
          'Teacher Only! You are unable to post!',
          HttpStatus.UNAUTHORIZED,
        );

      const createPostBody = {
        title: title,
        body: body,
        classroom_id: classroomId,
        user_id: userId,
      };
      return await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(PostsEntity)
        .values(createPostBody)
        .returning('*')
        .execute();
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPosts(classroomId: number, userId: number): Promise<any> {
    try {
      const user = await this.isUserJoined(userId, classroomId);
      if (!user)
        new HttpException(
          'You are unable to get posts from this classroom',
          HttpStatus.UNAUTHORIZED,
        );
      return await this.dataSource
        .getRepository(PostsEntity)
        .createQueryBuilder('posts')
        .leftJoin('posts.user_id', 'user')
        .select([
          'posts.title',
          'posts.body',
          'posts.created_at',
          'posts.updated_at',
          'user.full_name',
          'user.photo_profile',
        ])
        .where('posts.classroom_id = :id', { id: classroomId })
        .getMany();
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPost(classroomId: number, userId: number, postId: number) {
    try {
      const user = await this.isUserJoined(userId, classroomId);
      if (!user)
        return new HttpException(
          'You are unable to get post from this classroom',
          HttpStatus.UNAUTHORIZED,
        );

      return await this.dataSource
        .getRepository(PostsEntity)
        .createQueryBuilder('posts')
        .leftJoin('posts.user_id', 'user')
        .select([
          'posts.title',
          'posts.body',
          'posts.created_at',
          'posts.updated_at',
          'user.full_name',
          'user.photo_profile',
        ])
        .where('posts.id = :id', { id: postId })
        .getMany();
    } catch (error) {}
  }

  //async updatePost(){}

  //async deletePost(){}
}
