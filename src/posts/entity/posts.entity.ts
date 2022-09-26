import { chatMessageClassroomEntity } from 'src/chat_message_classroom/entity/chat_message_classroom.entity';
import { ClassroomEntity } from 'src/classroom/entity/classroom.entity';
import { PostCommentsEntity } from 'src/post_comments/entity/post_comments.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(() => PostCommentsEntity, (post_comments) => post_comments.post_id)
  @OneToMany(
    () => chatMessageClassroomEntity,
    (chat_message) => chat_message.classroom_id,
  )
  id: number;

  @Column({
    length: 100,
  })
  title: string;

  @Column()
  body: string;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.id)
  @JoinColumn({ name: 'classroom_id', referencedColumnName: 'id' })
  @Index()
  classroom_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
