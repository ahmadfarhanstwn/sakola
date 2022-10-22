import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtGuard from '../../../../auth/jwt.guard';
import { ChatMessageClassroomService } from '../../service/chat_message_classroom/chat_message_classroom.service';

@Controller('chat-classroom')
export class ChatMessageClassroomController {
  constructor(
    private readonly chatMessageClassroomService: ChatMessageClassroomService,
  ) {}

  @UseGuards(JwtGuard)
  @Get(':classroom_id')
  async getMessage(
    @Param(
      'classroom_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    classroom_id,
    @Req() req,
  ) {
    return await this.chatMessageClassroomService.getMessages(
      req.user.userId,
      classroom_id,
    );
  }
}
