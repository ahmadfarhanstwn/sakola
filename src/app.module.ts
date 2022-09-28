import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './models/user/entity/user.entity';
import { AuthController } from './auth/controller/auth/auth.controller';
import { AuthService } from './auth/service/auth/auth.service';
import { UserService } from './models/user/service/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClassroomModule } from './models/classroom/classroom.module';
import { ClassMembersModule } from './models/class_members/class_members.module';
import { WaitingApprovalModule } from './models/waiting_approval/waiting_approval.module';
import { ClassroomEntity } from './models/classroom/entity/classroom.entity';
import { ClassMembersEntity } from './models/class_members/entity/class_members.entity';
import { WaitingApprovalEntity } from './models/waiting_approval/entity/waiting_approval.entity';
import { PostsModule } from './models/posts/posts.module';
import { PostCommentsModule } from './models/post_comments/post_comments.module';
import { PostsEntity } from './models/posts/entity/posts.entity';
import { PostCommentsEntity } from './models/post_comments/entity/post_comments.entity';
import { ChatMessageClassroomModule } from './models/chat_message_classroom/chat_message_classroom.module';
import { chatMessageClassroomEntity } from './models/chat_message_classroom/entity/chat_message_classroom.entity';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        username: 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'sakola',
        entities: [
          UserEntity,
          ClassroomEntity,
          ClassMembersEntity,
          WaitingApprovalEntity,
          PostsEntity,
          PostCommentsEntity,
          chatMessageClassroomEntity,
        ],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ClassroomEntity,
      ClassMembersEntity,
      WaitingApprovalEntity,
      PostsEntity,
      PostCommentsEntity,
    ]),
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ClassroomModule,
    ClassMembersModule,
    WaitingApprovalModule,
    PostsModule,
    PostCommentsModule,
    ChatMessageClassroomModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AppModule {}
