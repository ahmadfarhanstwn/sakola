import { ClassMembersEntity } from 'src/class_members/entity/class_members.entity';
import { PostsEntity } from 'src/posts/entity/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PostSetting {
  AllPostComment = 'AllPostComment',
  StudentComment = 'StudentComment',
  OnlyTeacher = 'OnlyTeacher',
}

@Entity('classroom')
export class ClassroomEntity {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(
    () => ClassMembersEntity,
    (classMembers) => classMembers.classroom_id,
  )
  @OneToMany(() => PostsEntity, (posts) => posts.classroom_id)
  id: number;

  @Column({
    length: 255,
  })
  name: string;

  @Column({
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    comment:
      'TRUE means student must be approved by teacher to join, FALSE not',
    default: false,
  })
  join_approval: boolean;

  @Column({
    type: 'enum',
    enum: PostSetting,
    default: PostSetting.AllPostComment,
    comment:
      'AllPostComment = All members can post and comment, StudentComment = Student can only comment, OnlyTeacher = Only teacher can post and comment',
  })
  post_setting: PostSetting;

  @Column({
    default: 1,
  })
  members_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
