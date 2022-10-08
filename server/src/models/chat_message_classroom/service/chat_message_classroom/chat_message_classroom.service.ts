import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chatMessageClassroomEntity } from '../../entity/chat_message_classroom.entity';
import { PostsService } from '../../../posts/service/posts/posts.service';
import { DataSource, Repository } from 'typeorm';
import { deleteMessageDto, sendMessageDto } from '../../dto/delete_message.dto';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../../../../auth/service/auth/auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatMessageClassroomService {
  constructor(
    @InjectRepository(chatMessageClassroomEntity)
    private chatRepository: Repository<chatMessageClassroomEntity>,
    private postService: PostsService,
    private dataSource: DataSource,
    private authService: AuthService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication } = parse(cookie);
    const user = await this.authService.getUserFromAuthToken(Authentication);
    if (!user) throw new WsException('Invalid credentials.');
    return user;
  }

  async createMessage(
    userId: number,
    sendMessageDto: sendMessageDto,
  ): Promise<any> {
    const user = this.postService.isUserJoined(
      userId,
      sendMessageDto.classroom_id,
    );
    if (!user)
      return new HttpException(
        'You are unable to create chat in this classroom',
        HttpStatus.UNAUTHORIZED,
      );
    return await this.chatRepository.save({
      user_id: userId,
      classroom_id: sendMessageDto.classroom_id,
      message: sendMessageDto.message,
    });
  }

  async getMessages(user_id: number, classroom_id: number): Promise<any> {
    const user = this.postService.isUserJoined(user_id, classroom_id);
    if (!user)
      return new HttpException(
        'You are unable to see chat from this classroom',
        HttpStatus.UNAUTHORIZED,
      );

    return await this.dataSource
      .getRepository(chatMessageClassroomEntity)
      .createQueryBuilder('chat')
      .where('chat.classroom_id = :id', { id: classroom_id })
      .orderBy('chat.created_at', 'ASC');
  }

  async deleteMessage(inputDto: deleteMessageDto): Promise<any> {
    const user = this.postService.isUserJoined(
      inputDto.user_id,
      inputDto.classroom_id,
    );
    if (!user)
      return new HttpException(
        'You are unable to delete chat from this classroom',
        HttpStatus.UNAUTHORIZED,
      );

    const chat = await this.chatRepository.findOneBy({ id: inputDto.id });
    if (chat.user_id != inputDto.user_id)
      return new HttpException(
        "You are unable to delete other's chat from this classroom",
        HttpStatus.UNAUTHORIZED,
      );

    await this.chatRepository.delete({ id: inputDto.id });
    return true;
  }
}
