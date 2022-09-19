import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entity/posts.entity';
import { PostsService } from './service/posts/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  providers: [PostsService],
})
export class PostsModule {}
