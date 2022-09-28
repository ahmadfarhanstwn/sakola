import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PostCommentsEntity } from '../../entity/post_comments.entity';
import { DataSource } from 'typeorm';
import { PostsEntity } from '../../../posts/entity/posts.entity';

@Injectable()
export class PostCommentsService {
  constructor(private dataSource: DataSource) {}

  async findPost(postId: number): Promise<PostsEntity> {
    return await this.dataSource
      .getRepository(PostsEntity)
      .createQueryBuilder('post')
      .where('id = :id', { id: postId })
      .getOne();
  }

  async getComments(postId: number): Promise<any> {
    const post = await this.findPost(postId);
    if (!post)
      return new HttpException('Cannot find post', HttpStatus.NOT_FOUND);

    return await this.dataSource
      .getRepository(PostCommentsEntity)
      .createQueryBuilder('comments')
      .where('comments.post_id = :id', { id: postId })
      .orderBy('comments.created_at', 'ASC')
      .getMany();
  }

  async createPostComment(
    postId: number,
    userId: number,
    comment: string,
  ): Promise<any> {
    const post = await this.findPost(postId);
    if (!post)
      return new HttpException('Cannot find post', HttpStatus.NOT_FOUND);

    const createCommentDto = {
      comment: comment,
      postId: postId,
      userId: userId,
    };
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PostCommentsEntity)
      .values(createCommentDto)
      .execute();
    return true;
  }

  async getComment(id: number): Promise<PostCommentsEntity> {
    return await this.dataSource
      .getRepository(PostCommentsEntity)
      .createQueryBuilder('comments')
      .where('comments.id = :id', { id: id })
      .getOne();
  }

  async editComment(
    id: number,
    newComment: string,
    userId: number,
  ): Promise<any> {
    const comment = await this.getComment(id);
    if (!comment)
      return new HttpException('Comment not found', HttpStatus.NOT_FOUND);

    if (comment.user_id != userId)
      return new HttpException(
        'You are unable to edit this comment',
        HttpStatus.UNAUTHORIZED,
      );

    return await this.dataSource
      .getRepository(PostCommentsEntity)
      .createQueryBuilder()
      .update()
      .set({ comment: newComment })
      .where('id = :id', { id: id })
      .returning('*')
      .execute()[0];
  }

  async deleteComment(id: number, userId: number): Promise<any> {
    const comment = await this.getComment(id);
    if (!comment)
      return new HttpException('Comment not found', HttpStatus.NOT_FOUND);

    if (comment.user_id != userId)
      return new HttpException(
        'You are unable to edit this comment',
        HttpStatus.UNAUTHORIZED,
      );

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(PostCommentsEntity)
      .where('id = :id', { id: id })
      .execute();
    return true;
  }
}
