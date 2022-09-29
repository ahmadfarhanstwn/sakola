import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatMessageClassroomService } from '../../service/chat_message_classroom/chat_message_classroom.service';

@Controller('chat-message-classroom')
export class ChatMessageClassroomController {
  constructor(
    private readonly chatMessageClassroomService: ChatMessageClassroomService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:classroom_id')
  async getMessage(@Param() param, @Req() req) {
    return await this.chatMessageClassroomService.getMessages(
      req.user.id,
      param.classroom_id,
    );
  }
}
