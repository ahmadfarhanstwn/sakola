import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { ClassMembersEntity } from '../class_members/entity/class_members.entity';
import { ClassroomService } from './service/classroom/classroom.service';

@Injectable()
export class IsTeacherMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(ClassMembersEntity)
    private jwtService: JwtService,
    private readonly classroomService: ClassroomService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.Authentication;
    if (!token)
      throw new HttpException(
        'You are not logged in!',
        HttpStatus.UNAUTHORIZED,
      );
    const dataToken = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const isTeacher = await this.classroomService.IsTeacher(
      dataToken.userId,
      req.body.classroom_id,
    );
    if (!isTeacher)
      throw new HttpException('You are not teacher!', HttpStatus.UNAUTHORIZED);
    next();
  }
}
