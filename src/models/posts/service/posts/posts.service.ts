import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  ClassMemberRoleEnum,
  ClassMembersEntity,
} from '../../../class_members/entity/class_members.entity';
import { DataSource } from 'typeorm';
import {
  ClassroomEntity,
  PostSetting,
} from '../../../classroom/entity/classroom.entity';
import { PostsEntity } from '../../entity/posts.entity';

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
      .execute()[0];
  }

  async getPosts(classroomId: number, userId: number): Promise<any> {
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
      .orderBy('posts.created_at', 'DESC')
      .getMany();
  }

  async getPost(
    classroomId: number,
    userId: number,
    postId: number,
  ): Promise<any> {
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
        'posts.title AS title',
        'posts.body AS body',
        'posts.user_id AS user_id',
        'posts.created_at AS created_at',
        'posts.updated_at AS updated_at',
        'user.full_name AS full_name',
        'user.photo_profile AS photo_profile',
      ])
      .where('posts.id = :id', { id: postId })
      .getOne();
  }

  async updatePost(
    classroomId: number,
    userId: number,
    postId: number,
    title: string,
    body: string,
  ): Promise<any> {
    const user = await this.isUserJoined(userId, classroomId);
    if (!user)
      return new HttpException(
        'You are unable to update a post from this classroom',
        HttpStatus.UNAUTHORIZED,
      );

    const post = await this.getPost(classroomId, userId, postId);
    if (post.user_id != userId)
      return new HttpException(
        "You are unable to update other's post",
        HttpStatus.UNAUTHORIZED,
      );

    return await this.dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('posts')
      .update()
      .set({ title: title, body: body })
      .where('id = :id', { id: postId })
      .returning('*')
      .execute()[0];
  }

  async deletePost(
    classroomId: number,
    userId: number,
    postId: number,
  ): Promise<any> {
    const user = await this.isUserJoined(userId, classroomId);
    if (!user)
      return new HttpException(
        'You are unable to delete a post from this classroom',
        HttpStatus.UNAUTHORIZED,
      );

    const post = await this.getPost(classroomId, userId, postId);
    if (post.user_id != userId)
      return new HttpException(
        "You are unable to delete other's post",
        HttpStatus.UNAUTHORIZED,
      );

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(PostsEntity)
      .where('id = :id', { id: postId })
      .execute();
    return true;
  }
}
