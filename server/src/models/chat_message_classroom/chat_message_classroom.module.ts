import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageClassrooomGateway } from './chat_message_classroom.gateway';
import { chatMessageClassroomEntity } from './entity/chat_message_classroom.entity';
import { ChatMessageClassroomService } from './service/chat_message_classroom/chat_message_classroom.service';
import { ChatMessageClassroomController } from './controller/chat_message_classroom/chat_message_classroom.controller';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([chatMessageClassroomEntity]),
    PostsModule,
    AuthModule,
  ],
  providers: [ChatMessageClassrooomGateway, ChatMessageClassroomService],
  controllers: [ChatMessageClassroomController],
})
export class ChatMessageClassroomModule {}
