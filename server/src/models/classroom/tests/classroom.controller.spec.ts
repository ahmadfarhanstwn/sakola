import { Test } from '@nestjs/testing';
import { ClassroomController } from '../controller/classroom/classroom.controller';
import { ClassroomEntity } from '../entity/classroom.entity';
import { ClassroomService } from '../service/classroom/classroom.service';

jest.mock('../classroom.service');

describe('classroomController', () => {
  let classroomController: ClassroomController;
  let classroomService: ClassroomService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [ClassroomController],
      providers: [ClassroomService],
    }).compile();

    classroomController =
      moduleRef.get<ClassroomController>(ClassroomController);
    classroomService = moduleRef.get<ClassroomService>(ClassroomService);
    jest.clearAllMocks();
  });

  describe('createClassroom', () => {
    describe('when create classroom is called', () => {
      //TESTING IN NEST JS IS VERY COMPLICATED, SHOULD I GIVE UP HERE????
    });
  });
});
