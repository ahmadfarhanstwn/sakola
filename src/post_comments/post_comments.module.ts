import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentsEntity } from './entity/post_comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostCommentsEntity])],
})
export class PostCommentsModule {}
