import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entity/posts.entity';
import { PostsService } from './service/posts/posts.service';
import { PostsController } from './controller/posts/posts.controller';
import { isJoinedClassroomMiddleware } from './is_joined_classroom.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isJoinedClassroomMiddleware)
      .forRoutes(
        'posts',
        'posts/:classroom_id',
        'posts/:classroom_id/:post_id',
      );
  }
}
