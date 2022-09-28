import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentsEntity } from './entity/post_comments.entity';
import { PostCommentsService } from './service/post_comments/post_comments.service';
import { PostCommentsController } from './controller/post_comments/post_comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostCommentsEntity])],
  providers: [PostCommentsService],
  controllers: [PostCommentsController],
})
export class PostCommentsModule {}
