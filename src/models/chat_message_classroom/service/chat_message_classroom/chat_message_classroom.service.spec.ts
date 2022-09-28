import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageClassroomService } from './chat_message_classroom.service';

describe('ChatMessageClassroomService', () => {
  let service: ChatMessageClassroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessageClassroomService],
    }).compile();

    service = module.get<ChatMessageClassroomService>(
      ChatMessageClassroomService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
