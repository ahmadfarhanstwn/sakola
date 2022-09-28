import { ClassroomEntity } from '../../classroom/entity/classroom.entity';
import { UserEntity } from '../../user/entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('waiting_approval')
export class WaitingApprovalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => ClassroomEntity, (classroomEntity) => classroomEntity.id)
  @JoinColumn({ name: 'classroom_id', referencedColumnName: 'id' })
  @Index()
  classroom_id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Index()
  user_id: number;

  @CreateDateColumn()
  joined_date: Date;
}
