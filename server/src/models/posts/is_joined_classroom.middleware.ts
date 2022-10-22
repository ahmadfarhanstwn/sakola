import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PostsService } from './service/posts/posts.service';

@Injectable()
export class isJoinedClassroomMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly postsService: PostsService,
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
    const isJoinedClassroom = await this.postsService.isUserJoined(
      dataToken.userId,
      parseInt(req.params.classroom_id),
    );
    if (!isJoinedClassroom)
      throw new HttpException(
        'You are not joined this classroom!',
        HttpStatus.UNAUTHORIZED,
      );
    next();
  }
}
