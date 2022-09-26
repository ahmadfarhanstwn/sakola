import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageGateway } from './chat_message_classroom.gateway';

describe('ChatMessageGateway', () => {
  let gateway: ChatMessageGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessageGateway],
    }).compile();

    gateway = module.get<ChatMessageGateway>(ChatMessageGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
