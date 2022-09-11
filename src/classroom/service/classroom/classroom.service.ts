import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomEntity } from '../../entity/classroom.entity';
import {
  ClassMemberRoleEnum,
  ClassMembersEntity,
} from '../../../class_members/entity/class_members.entity';
import { DataSource, Repository } from 'typeorm';
import { WaitingApprovalEntity } from '../../../waiting_approval/entity/waiting_approval.entity';

// TODO : IMPLEMENTING DATABASE TRANSACTION ???

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private classroomRepository: Repository<ClassroomEntity>,
    @InjectRepository(ClassMembersEntity)
    private classMembersRepository: Repository<ClassMembersEntity>,
    @InjectRepository(WaitingApprovalEntity)
    private waitingApprovalRepository: Repository<WaitingApprovalEntity>,
    private dataSource: DataSource,
  ) {}

  async createClassroom(
    classroom: ClassroomEntity,
    userId: number,
  ): Promise<any> {
    try {
      const newClassroom = await this.classroomRepository.save(classroom);
      const classMembersBody = {
        role: ClassMemberRoleEnum.Teacher,
        classroom_id: newClassroom.id,
        user_id: userId,
      };
      await this.classMembersRepository.insert(classMembersBody);
      return newClassroom;
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async joinClassroom(userId: number, classroomId: number): Promise<any> {
    try {
      /*
        logic :
        - find classroom,
        - check classroom.join_approval
        - if classroom.join_approval is true, insert user and classroom to waiting_approval table
        - else add user to class_members table
      */
      const classroom = await this.dataSource
        .getRepository(ClassroomEntity)
        .createQueryBuilder('classroom')
        .where('classroom.id = :id', { id: classroomId })
        .getOne();
      if (!classroom)
        return new HttpException(
          'Classroom is not found',
          HttpStatus.BAD_REQUEST,
        );

      const userIsJoined = await this.dataSource
        .getRepository(ClassMembersEntity)
        .createQueryBuilder('class_members')
        .where('class_members.classroom_id = :classroom_id', {
          classroom_id: classroomId,
        })
        .andWhere('class_members.user_id = :user_id', { user_id: userId })
        .getOne();
      if (userIsJoined)
        return new HttpException(
          `User with id : ${userId} has already joined in classroom ${classroomId}`,
          HttpStatus.BAD_REQUEST,
        );

      if (classroom.join_approval) {
        const waitingApprovalBody = {
          classroom_id: classroomId,
          user_id: userId,
        };
        return await this.waitingApprovalRepository.save(waitingApprovalBody);
      }

      await this.classroomRepository.update(
        { id: classroomId },
        { members_count: classroom.members_count + 1 },
      );
      const classMembersBody = {
        role: ClassMemberRoleEnum.Student,
        classroom_id: classroomId,
        user_id: userId,
      };
      return await this.classMembersRepository.save(classMembersBody);
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //NOT SURE, SHOULD I PUT THIS CODE HERE OR IN WAITING APPROVAL SERVICE
  async approveWaiting(classroomId: number, userId: number): Promise<any> {
    /*
      logic :
      - find waiting approval by classroom id
      - add user id and classroom id to class_members table
      - delete data from waiting approval table
    */
    try {
      const classMembersBody = {
        role: ClassMemberRoleEnum.Student,
        classroom_id: classroomId,
        user_id: userId,
      };
      await this.classMembersRepository.insert(classMembersBody);
      await this.dataSource
        .createQueryBuilder()
        .update(ClassroomEntity)
        .set({ members_count: () => 'members_count + 1' })
        .execute();
      await this.waitingApprovalRepository.delete({
        classroom_id: classroomId,
        user_id: userId,
      });
      return true;
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async rejectJoin(classroomId: number, userId: number): Promise<any> {
    try {
      await this.waitingApprovalRepository.delete({
        classroom_id: classroomId,
        user_id: userId,
      });
      return true;
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWaitingApprovals(classroomId: number): Promise<any> {
    try {
      return await this.dataSource
        .getRepository(WaitingApprovalEntity)
        .createQueryBuilder('waiting_approval')
        .select(['waiting_approval.user_id', 'waiting_approval.joined_date'])
        .where('waiting_approval.classroom_id = :id', { id: classroomId })
        .getMany();
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //async kickMember()

  //async deleteClassroom()
}
