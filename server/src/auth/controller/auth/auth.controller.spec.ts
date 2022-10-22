import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../service/auth/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signUp: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('sign up should be called', async () => {
    expect(
      await controller.signUp({
        email: 'jokkkowi@gmail.com',
        full_name: 'Jokkko Weeds',
        password: 'sayajokkkowi',
      }),
    ).toHaveBeenCalled();
  });
});
