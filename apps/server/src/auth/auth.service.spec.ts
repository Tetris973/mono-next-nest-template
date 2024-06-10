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
    it('should return a token signed from user id', async () => {
      // INIT
      const user = { id: 1 } as User;

      // RUN
      const token = await service.login(user);

      // CHECK RESULTS
      expect(mockedJwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
      });
      expect(token.accessToken).toBe('token');
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
        username: 'userAlreadyInUse',
      });

      // RUN  & CHECK RESULTS
      await expect(service.signup(createUserDto)).rejects.toThrow(
        `Username ${createUserDto.username} is already in use.`,
      );
    });
  });

  describe('validateCredentials', async () => {
    const password = 'pass';
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = 'tetris';

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

    it('should throw an error if the password is incorrect', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue({
        username,
        password: hashedPassword,
      });

      // RUN
      await expect(service.validateCredentials(username, 'wrongpass')).rejects.toThrow('The password is incorrect');
    });

    it('should throw an error if the user does not exist', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue(null);

      // RUN
      await expect(service.validateCredentials('nonexistent', 'pass')).rejects.toThrow('The username does not exist.');
    });
  });
});
