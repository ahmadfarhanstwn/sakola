import { ClassroomEntity } from '../../classroom/entity/classroom.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

export enum ClassMemberRoleEnum {
  Teacher = 'Teacher',
  Student = 'Student',
}

@Entity('class_members')
export class ClassMembersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'enum',
    enum: ClassMemberRoleEnum,
  })
  role: ClassMemberRoleEnum;

  @CreateDateColumn()
  join_date: Date;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.id)
  @JoinColumn({ name: 'classroom_id', referencedColumnName: 'id' })
  @Index()
  classroom_id!: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Index()
  user_id!: number;
}
