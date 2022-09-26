import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatMessageClassroomService } from './service/chat_message_classroom/chat_message_classroom.service';
import { Server } from 'socket.io';
import { chatMessageClassroomEntity } from './entity/chat_message_classroom.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatMessageClassrooomGateway {
  constructor(
    private chatMessageClassroomService: ChatMessageClassroomService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: any,
    payload: chatMessageClassroomEntity,
  ): Promise<void> {
    await this.chatMessageClassroomService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(client: any, payload: chatMessageClassroomEntity) {
    await this.chatMessageClassroomService.deleteMessage(payload);
    this.server.emit('recMessage', payload);
  }
}
