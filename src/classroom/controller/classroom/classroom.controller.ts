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
    return await this.classroomService.joinClassroom(
      req.user.id,
      req.body.classroom_id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('accept')
  async acceptWaiting(@Req() req) {
    return await this.classroomService.acceptJoin(
      req.body.classroom_id,
      req.body.user_id,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reject')
  async rejectWaiting(@Req() req) {
    return await this.classroomService.rejectJoin(
      req.body.classroom_id,
      req.body.user_id,
      req.user.id,
    );
  }

  // TODO : Finds out why this function doesn't return user_id
  @UseGuards(AuthGuard('jwt'))
  @Get('waiting/:id')
  async getWaitingList(@Param() param, @Req() req) {
    return await this.classroomService.getWaitingApprovals(
      param.id,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('remove-member')
  async removeMember(@Req() req) {
    return await this.classroomService.removeMember(
      req.body.classroom_id,
      req.body.user_id,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete')
  async deleteClassroom(@Req() req) {
    return await this.classroomService.deleteClassroom(
      req.body.classroom_id,
      req.user.id,
    );
  }
}
