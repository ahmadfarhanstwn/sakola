import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageClassrooomGateway } from './chat_message_classroom.gateway';

describe('ChatMessageGateway', () => {
  let gateway: ChatMessageClassrooomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessageClassrooomGateway],
    }).compile();

    gateway = module.get<ChatMessageClassrooomGateway>(
      ChatMessageClassrooomGateway,
    );
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
