import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../models/user/entity/user.entity';
import { AuthService } from './auth.service';
import * as bcryptUtils from '../../../util/bcrypt.util';
import { Repository } from 'typeorm';

describe('Auth Service', () => {
  let service: AuthService;
  let userRepository: Repository<UserEntity>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            update: jest.fn(),
            insert: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
          },
        },
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
  });

  describe('Sign Up', async () => {
    await jest
      .spyOn(bcryptUtils, 'encodePassword')
      .mockResolvedValueOnce('jokkowi');

    it('should be defined', async () => {
      expect(service).toBeDefined();
    });

    it('should encode password with bcrypt', async () => {
      await service.signUp({
        email: 'jokkowi@gmail.com',
        full_name: 'Jokkowi',
        password: 'sayajokkowi',
      });
      expect(bcryptUtils.encodePassword).toHaveBeenCalledWith('sayajokkowi');
    });

    it('should call insert with correct params', async () => {
      await service.signUp({
        email: 'jokkowi@gmail.com',
        full_name: 'Jokkowi',
        password: 'sayajokkowi',
      });
      expect(userRepository.insert).toHaveBeenCalledWith();
    });
  });
});
