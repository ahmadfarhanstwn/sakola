import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chatMessageClassroomEntity } from '../../entity/chat_message_classroom.entity';
import { PostsService } from '../../../posts/service/posts/posts.service';
import { Repository } from 'typeorm';
import { deleteMessageDto } from '../../dto/delete_message.dto';

@Injectable()
export class ChatMessageClassroomService {
  constructor(
    @InjectRepository(chatMessageClassroomEntity)
    private chatRepository: Repository<chatMessageClassroomEntity>,
    private postService: PostsService,
  ) {}

  async createMessage(chat: chatMessageClassroomEntity): Promise<any> {
    const user = this.postService.isUserJoined(chat.user_id, chat.classroom_id);
    if (!user)
      return new HttpException(
        'You are unable to create chat in this classroom',
        HttpStatus.UNAUTHORIZED,
      );
    return await this.chatRepository.save(chat);
  }

  async getMessages(user_id: number, classroom_id: number): Promise<any> {
    const user = this.postService.isUserJoined(user_id, classroom_id);
    if (!user)
      return new HttpException(
        'You are unable to see chat from this classroom',
        HttpStatus.UNAUTHORIZED,
      );

    return await this.chatRepository.findBy({ classroom_id: classroom_id });
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
