import { PostsEntity } from 'src/posts/entity/posts.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PostCommentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  comment: string;

  @ManyToOne(() => PostsEntity, (posts) => posts.id)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  @Index()
  updated_at: Date;
}
