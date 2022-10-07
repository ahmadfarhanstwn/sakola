import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import JwtRefreshGuard from '../../../../auth/jwt_refresh.guard';
import { ChatMessageClassroomService } from '../../service/chat_message_classroom/chat_message_classroom.service';

@Controller('chat-classroom')
export class ChatMessageClassroomController {
  constructor(
    private readonly chatMessageClassroomService: ChatMessageClassroomService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get(':classroom_id')
  async getMessage(@Param() param, @Req() req) {
    return await this.chatMessageClassroomService.getMessages(
      req.user.id,
      param.classroom_id,
    );
  }
}
