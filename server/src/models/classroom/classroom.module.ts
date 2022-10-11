import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClassroomService } from './service/classroom/classroom.service';
import { ClassroomController } from './controller/classroom/classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './entity/classroom.entity';
import { ClassMembersEntity } from '../class_members/entity/class_members.entity';
import { WaitingApprovalEntity } from '../waiting_approval/entity/waiting_approval.entity';
import { ClassMembersModule } from '../class_members/class_members.module';
import { WaitingApprovalModule } from '../waiting_approval/waiting_approval.module';
import { IsTeacherMiddleware } from './is_teacher.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClassMembersModule,
    TypeOrmModule.forFeature([
      ClassroomEntity,
      ClassMembersEntity,
      WaitingApprovalEntity,
    ]),
    WaitingApprovalModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [ClassroomService],
  controllers: [ClassroomController],
})
export class ClassroomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsTeacherMiddleware)
      .forRoutes(
        'classroom/accept',
        'classroom/reject',
        'classroom/:id/waiting',
        'classroom/remove-member',
        'classroom/:classroom_id',
      );
  }
}
