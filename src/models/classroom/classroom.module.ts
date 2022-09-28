import { Module } from '@nestjs/common';
import { ClassroomService } from './service/classroom/classroom.service';
import { ClassroomController } from './controller/classroom/classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './entity/classroom.entity';
import { ClassMembersEntity } from '../class_members/entity/class_members.entity';
import { WaitingApprovalEntity } from '../waiting_approval/entity/waiting_approval.entity';
import { ClassMembersModule } from '../class_members/class_members.module';
import { WaitingApprovalModule } from '../waiting_approval/waiting_approval.module';

@Module({
  imports: [
    ClassMembersModule,
    TypeOrmModule.forFeature([
      ClassroomEntity,
      ClassMembersEntity,
      WaitingApprovalEntity,
    ]),
    WaitingApprovalModule,
  ],
  providers: [ClassroomService],
  controllers: [ClassroomController],
})
export class ClassroomModule {}
