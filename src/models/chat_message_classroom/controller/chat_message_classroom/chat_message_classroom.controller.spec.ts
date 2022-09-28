import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageClassroomController } from './chat_message_classroom.controller';

describe('ChatMessageClassroomController', () => {
  let controller: ChatMessageClassroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessageClassroomController],
    }).compile();

    controller = module.get<ChatMessageClassroomController>(
      ChatMessageClassroomController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
