import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatMessageClassroomService } from './service/chat_message_classroom/chat_message_classroom.service';
import { Server, Socket } from 'socket.io';
import { chatMessageClassroomEntity } from './entity/chat_message_classroom.entity';
import { sendMessageDto } from './dto/delete_message.dto';

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

  async handleConnection(socket: Socket) {
    await this.chatMessageClassroomService.getUserFromSocket(socket);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() sendMessageDto: sendMessageDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user = await this.chatMessageClassroomService.getUserFromSocket(
      socket,
    );
    const message = await this.chatMessageClassroomService.createMessage(
      user.id,
      sendMessageDto,
    );
    this.server.emit('rec_message', message);
  }

  @SubscribeMessage('get_all_messages_classroom')
  //@MessageBody('classroom_id') IS TEMPORARY
  async getAllMessageClassroom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('classroom_id') classroom_id: number,
  ) {
    const user = await this.chatMessageClassroomService.getUserFromSocket(
      socket,
    );
    const messages = await this.chatMessageClassroomService.getMessages(
      user.id,
      classroom_id,
    );
    this.server.sockets.emit('send_all_message_classroom', messages);
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(client: any, payload: chatMessageClassroomEntity) {
    await this.chatMessageClassroomService.deleteMessage(payload);
    this.server.emit('rec_message', payload);
  }
}
