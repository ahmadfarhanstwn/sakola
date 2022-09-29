import { ClassroomEntity } from '../../classroom/entity/classroom.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class chatMessageClassroomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.id)
  @JoinColumn({ name: 'classroom_id', referencedColumnName: 'id' })
  @Index()
  classroom_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;
}
