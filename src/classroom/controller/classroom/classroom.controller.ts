import { Controller, Post, Req, UseGuards, Get, Param } from '@nestjs/common';
import { ClassroomService } from '../../service/classroom/classroom.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createClassroom(@Req() req) {
    return await this.classroomService.createClassroom(req.body, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('join')
  async joinClassroom(@Req() req) {
    // console.log(req.user.id);
    return await this.classroomService.joinClassroom(
      req.user.id,
      req.body.classroom_id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('approve')
  async approveWaiting(@Req() req) {
    return await this.classroomService.approveWaiting(
      req.body.classroom_id,
      req.body.user_id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('waiting/:id')
  async getWaitingList(@Param() param) {
    return await this.classroomService.getWaitingApprovals(param.id);
  }
}
