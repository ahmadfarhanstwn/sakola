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
    const queryRunner = await this.dataSource.createQueryRunner();

    try {
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

      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .update(ClassroomEntity)
        .set({ members_count: classroom.members_count + 1 })
        .where('id = :id', { id: classroomId })
        .execute();
      const classMembersBody = {
        role: ClassMemberRoleEnum.Student,
        classroom_id: classroomId,
        user_id: userId,
      };
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(ClassMembersEntity)
        .values(classMembersBody)
        .execute();
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async IsTeacher(userId: number, classroomId: number): Promise<boolean> {
    const user = await this.dataSource
      .getRepository(ClassMembersEntity)
      .createQueryBuilder('class_members')
      .where('class_members.classroom_id = :classroom_id', {
        classroom_id: classroomId,
      })
      .andWhere('class_members.user_id = :user_id', { user_id: userId })
      .getOne();
    if (!user) return false;
    return user.role == ClassMemberRoleEnum.Teacher ? true : false;
  }

  async acceptJoin(
    classroomId: number,
    joiningUserId: number,
    userId: number,
  ): Promise<any> {
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      const isTeacher = this.IsTeacher(userId, classroomId);
      if (!isTeacher)
        return new HttpException(
          'Forbidden! You are unable to accept!',
          HttpStatus.FORBIDDEN,
        );

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const classMembersBody = {
        role: ClassMemberRoleEnum.Student,
        classroom_id: classroomId,
        user_id: joiningUserId,
      };
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .insert()
        .into(ClassMembersEntity)
        .values(classMembersBody)
        .execute();
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .update(ClassroomEntity)
        .where('id = :id', { id: classroomId })
        .set({ members_count: () => 'members_count + 1' })
        .execute();
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .delete()
        .from(WaitingApprovalEntity)
        .where('classroom_id = :classroom_id', { classroom_id: classroomId })
        .andWhere('user_id = :user_id', { user_id: joiningUserId })
        .execute();

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async rejectJoin(
    classroomId: number,
    joiningUserId: number,
    userId: number,
  ): Promise<any> {
    try {
      const isTeacher = this.IsTeacher(userId, classroomId);
      if (!isTeacher)
        return new HttpException(
          'Forbidden! You are unable to accept!',
          HttpStatus.FORBIDDEN,
        );

      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(WaitingApprovalEntity)
        .where('classroom_id = :classroom_id', { classroom_id: classroomId })
        .andWhere('user_id = :user_id', { user_id: joiningUserId })
        .execute();
      return true;
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getWaitingApprovals(classroomId: number, userId: number): Promise<any> {
    try {
      const isTeacher = await this.IsTeacher(userId, classroomId);
      if (!isTeacher)
        return new HttpException(
          'Forbidden! You are unable to accept!',
          HttpStatus.FORBIDDEN,
        );

      return await this.dataSource
        .getRepository(WaitingApprovalEntity)
        .createQueryBuilder('waiting_approval')
        .leftJoin('waiting_approval.user_id', 'user')
        .select([
          'waiting_approval.joined_date',
          'user.id',
          'user.full_name',
          'user.photo_profile',
        ])
        .where('waiting_approval.classroom_id = :id', { id: classroomId })
        .getMany();
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeMember(
    classroomId: number,
    memberUserId: number,
    userId: number,
  ): Promise<any> {
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      const isTeacher = this.IsTeacher(userId, classroomId);
      if (!isTeacher)
        return new HttpException(
          'Forbidden! You are unable to accept!',
          HttpStatus.FORBIDDEN,
        );

      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.dataSource
        .createQueryBuilder(queryRunner)
        .delete()
        .from(ClassMembersEntity)
        .where('classroom_id = :classroom_id', { classroom_id: classroomId })
        .andWhere('user_id = :user_id', { user_id: memberUserId })
        .execute();
      await this.dataSource
        .createQueryBuilder(queryRunner)
        .update(ClassroomEntity)
        .set({ members_count: () => 'members_count - 1' })
        .execute();

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      if (queryRunner.isTransactionActive) queryRunner.rollbackTransaction();
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteClassroom(classroomId: number, userId: number): Promise<any> {
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      const isTeacher = this.IsTeacher(userId, classroomId);
      if (!isTeacher)
        return new HttpException(
          'Forbidden! You are unable to accept!',
          HttpStatus.FORBIDDEN,
        );

      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(ClassMembersEntity)
        .where('classroom_id = :classroom_id', { classroom_id: classroomId })
        .execute();
      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(ClassroomEntity)
        .where('id = :classroom_id', { classroom_id: classroomId })
        .execute();

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      if (queryRunner.isTransactionActive) queryRunner.rollbackTransaction();
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async isJoined(userId: number, classroomId: number): Promise<any> {
    const user = await this.dataSource
      .getRepository(ClassMembersEntity)
      .createQueryBuilder('class_members')
      .where('class_members.classroom_id = :classroom_id', {
        classroom_id: classroomId,
      })
      .andWhere('class_members.user_id = :user_id', { user_id: userId })
      .getOne();
    return user ? true : false;
  }

  async getClassroomMembers(classroomId: number, userId: number): Promise<any> {
    try {
      const is_joined = this.isJoined(userId, classroomId);
      if (!is_joined)
        return new HttpException(
          'You are not the member of this classroom',
          HttpStatus.UNAUTHORIZED,
        );

      return await this.dataSource
        .getRepository(ClassMembersEntity)
        .createQueryBuilder('classroom_members')
        .innerJoin('classroom_members.user_id', 'user')
        .select([
          'classroom_members.role',
          'user.id',
          'user.full_name',
          'user.photo_profile',
        ])
        .where('classroom_members.classroom_id = :id', { id: classroomId })
        .getMany();
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
