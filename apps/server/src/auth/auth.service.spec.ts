import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '@server/user/dto/create-user.dto';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockedJwtService = {
    signAsync: vi.fn().mockResolvedValue('token'),
  };

  const mockedUserService = {
    create: vi.fn(),
    findOne: vi.fn(),
    userCredentials: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return mockedUserService;
        }
        if (token === JwtService) {
          return mockedJwtService;
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token signed from username and id', async () => {
      // INIT
      const user = { id: 1, username: 'tetris' } as User;

      // RUN
      const token = await service.login(user);

      // CHECK RESULTS
      expect(mockedJwtService.signAsync).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
      });
      expect(token.access_token).toBe('token');
    });
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      // INIT
      const createUserDto = {
        username: 'tetris',
        password: 'pass',
      } as CreateUserDto;

      // RUN
      await service.signup(createUserDto);

      // CHECK RESULTS
      expect(mockedUserService.findOne).toHaveBeenCalledWith({
        username: createUserDto.username,
      });
      expect(mockedUserService.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        password: expect.not.stringMatching(createUserDto.password),
      });
    });

    it('should throw an error if the username is already taken', async () => {
      // INIT
      const createUserDto = {
        username: 'tetris',
        password: 'pass',
      } as CreateUserDto;

      mockedUserService.findOne.mockResolvedValue({
        username: 'userLareadyExist',
      });

      // RUN  & CHECK RESULTS
      await expect(service.signup(createUserDto)).rejects.toThrow(
        'Username is already taken',
      );
    });
  });

  describe('validateCredentials', async () => {
    const password = 'pass';
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = 'tetris';

    it('should return null if the user does not exist', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue(null);

      // RUN
      const result = await service.validateCredentials('nonexistent', 'pass');

      //  CHECK RESULTS
      expect(result).toBeNull();
    });

    it('should return null if the password is incorrect', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue({
        username,
        password: hashedPassword,
      });

      // RUN
      const result = await service.validateCredentials(username, 'wrongpass');

      // CHECK RESULTS
      expect(result).toBeNull();
    });

    it('should return a user if the credentials are valid', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue({
        username,
        password: hashedPassword,
      });
      mockedUserService.findOne.mockResolvedValue({
        id: 1,
        username,
      });

      // RUN
      const result = await service.validateCredentials(username, password);

      // CHECK RESULTS
      expect(result).toEqual({ id: 1, username });
    });
  });
});
