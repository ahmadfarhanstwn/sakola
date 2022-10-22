import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  Body,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { ClassroomService } from '../../service/classroom/classroom.service';
import {
  acceptRejectJoinDto,
  acceptRejectJoinSchema,
  createClassroomDto,
  createClassroomSchema,
} from '../../dto/classroom.dto';
import JwtGuard from '../../../../auth/jwt.guard';
import { JoiValidationPipe } from '../../../../pipes/joi_validation.pipe';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseGuards(JwtGuard)
  @UsePipes(new JoiValidationPipe(createClassroomSchema))
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
  @UsePipes(new JoiValidationPipe(acceptRejectJoinSchema))
  @Post('accept')
  async acceptWaiting(@Req() req, @Body() inputDto: acceptRejectJoinDto) {
    return await this.classroomService.acceptJoin(
      inputDto.classroom_id,
      inputDto.joining_user_id,
    );
  }

  @UseGuards(JwtGuard)
  @UsePipes(new JoiValidationPipe(acceptRejectJoinSchema))
  @Post('reject')
  async rejectWaiting(@Req() req, @Body() inputDto: acceptRejectJoinDto) {
    return await this.classroomService.rejectJoin(
      inputDto.classroom_id,
      inputDto.joining_user_id,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':id/waiting')
  async getWaitingList(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.classroomService.getWaitingApprovals(id);
  }

  @UseGuards(JwtGuard)
  @UsePipes(new JoiValidationPipe(acceptRejectJoinSchema))
  @Delete('remove-member')
  async removeMember(@Body() inputDto: acceptRejectJoinDto) {
    return await this.classroomService.removeMember(
      inputDto.classroom_id,
      inputDto.joining_user_id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':classroom_id')
  async deleteClassroom(
    @Param(
      'classroom_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    classroom_id: number,
  ) {
    return await this.classroomService.deleteClassroom(classroom_id);
  }

  @UseGuards(JwtGuard)
  @Get(':classroom_id/members')
  async getClassroomMembers(
    @Param(
      'classroom_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    classroom_id: number,
    @Req() req,
  ) {
    return await this.classroomService.getClassroomMembers(
      classroom_id,
      req.user.id,
    );
  }
}
