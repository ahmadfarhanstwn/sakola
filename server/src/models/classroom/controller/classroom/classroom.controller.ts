import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { ClassroomService } from '../../service/classroom/classroom.service';
import {
  acceptRejectJoinDto,
  createClassroomDto,
} from '../../dto/classroom.dto';
import JwtGuard from '../../../../auth/jwt.guard';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseGuards(JwtGuard)
  @Post('')
  async createClassroom(@Req() req, @Body() inputDto: createClassroomDto) {
    return await this.classroomService.createClassroom(inputDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('join')
  async joinClassroom(@Req() req) {
    return await this.classroomService.joinClassroom(
      req.user.id,
      req.body.classroom_id,
    );
  }

  @UseGuards(JwtGuard)
  @Post('accept')
  async acceptWaiting(@Req() req, @Body() inputDto: acceptRejectJoinDto) {
    return await this.classroomService.acceptJoin(
      inputDto.classroom_id,
      inputDto.joining_user_id,
    );
  }

  @UseGuards(JwtGuard)
  @Post('reject')
  async rejectWaiting(@Req() req, @Body() inputDto: acceptRejectJoinDto) {
    return await this.classroomService.rejectJoin(
      inputDto.classroom_id,
      inputDto.joining_user_id,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':id/waiting')
  async getWaitingList(@Param() param, @Req() req) {
    return await this.classroomService.getWaitingApprovals(param.id);
  }

  @UseGuards(JwtGuard)
  @Delete('remove-member')
  async removeMember(@Req() req, @Body() inputDto: acceptRejectJoinDto) {
    return await this.classroomService.removeMember(
      inputDto.classroom_id,
      inputDto.joining_user_id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':classroom_id')
  async deleteClassroom(@Req() req, @Param() param) {
    return await this.classroomService.deleteClassroom(param.classroom_id);
  }

  @UseGuards(JwtGuard)
  @Get(':classroom_id/members')
  async getClassroomMembers(@Param() param, @Req() req) {
    return await this.classroomService.getClassroomMembers(
      param.classroom_id,
      req.user.id,
    );
  }
}
