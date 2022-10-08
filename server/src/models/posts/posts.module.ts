import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entity/posts.entity';
import { PostsService } from './service/posts/posts.service';
import { PostsController } from './controller/posts/posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
