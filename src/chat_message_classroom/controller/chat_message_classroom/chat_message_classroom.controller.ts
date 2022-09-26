import { Controller, Get, Param, Req } from '@nestjs/common';
import { ChatMessageClassroomService } from 'src/chat_message_classroom/service/chat_message_classroom/chat_message_classroom.service';

@Controller('chat-message-classroom')
export class ChatMessageClassroomController {
  constructor(
    private readonly chatMessageClassroomService: ChatMessageClassroomService,
  ) {}

  @Get('/:classroom_id')
  async getMessage(@Param() param, @Req() req) {
    return await this.chatMessageClassroomService.getMessages(
      req.user.id,
      param.classroom_id,
    );
  }
}
