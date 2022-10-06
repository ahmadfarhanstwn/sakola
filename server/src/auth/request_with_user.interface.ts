import { Request } from 'express';
import { UserEntity } from '../models/user/entity/user.entity';

export interface RequestWithUser extends Request {
  user: UserEntity;
}
