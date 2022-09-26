import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/entity/user.entity';
import { AuthController } from './auth/controller/auth/auth.controller';
import { AuthService } from './auth/service/auth/auth.service';
import { UserService } from './user/service/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClassroomModule } from './classroom/classroom.module';
import { ClassMembersModule } from './class_members/class_members.module';
import { WaitingApprovalModule } from './waiting_approval/waiting_approval.module';
import { ClassroomEntity } from './classroom/entity/classroom.entity';
import { ClassMembersEntity } from './class_members/entity/class_members.entity';
import { WaitingApprovalEntity } from './waiting_approval/entity/waiting_approval.entity';
import { PostsModule } from './posts/posts.module';
import { PostCommentsModule } from './post_comments/post_comments.module';
import { PostsEntity } from './posts/entity/posts.entity';
import { PostCommentsEntity } from './post_comments/entity/post_comments.entity';
import { ChatMessageClassroomModule } from './chat_message_classroom/chat_message_classroom.module';
import { chatMessageClassroomEntity } from './chat_message_classroom/entity/chat_message_classroom.entity';

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
