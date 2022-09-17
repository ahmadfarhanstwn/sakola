import { Module } from '@nestjs/common';
import { PostsService } from './service/posts/posts.service';

@Module({
  providers: [PostsService]
})
export class PostsModule {}
