import { ClassMembersEntity } from 'src/class_members/entity/class_members.entity';
import { PostsEntity } from 'src/posts/entity/posts.entity';
import { PostCommentsEntity } from 'src/post_comments/entity/post_comments.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(() => ClassMembersEntity, (classMembers) => classMembers.user_id)
  @OneToMany(() => PostsEntity, (posts) => posts.user_id)
  @OneToMany(() => PostCommentsEntity, (post_comments) => post_comments.user_id)
  id: number;

  @Column({
    length: 255,
  })
  full_name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    select: false,
    nullable: true,
  })
  auth_confirm_token: string;

  @Column({
    default: false,
    nullable: true,
  })
  is_verified: boolean;

  @Column({
    nullable: true,
  })
  photo_profile: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
