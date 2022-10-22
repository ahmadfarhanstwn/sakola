import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomController } from './classroom.controller';

describe('ClassroomController', () => {
  let controller: ClassroomController;

  let requestMock = {
    body: {},
    user: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomController],
    }).compile();

    controller = module.get<ClassroomController>(ClassroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createClassroom', () => {
    it('should create a classroom', () => {});
  });
});
