import { describe, beforeEach, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@server/modules/user/dto/create-user.dto';
import { UserDto } from '@server/modules/user/dto/user.dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ConfigModule } from '@server/config/config.module';

describe('AuthController', () => {
  let controller: AuthController;

  const mockedAuthService = {
    signup: vi.fn(),
    login: vi.fn(),
  };

  const mockedResponse: Partial<Response> = {
    cookie: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockedAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should return a transformed UserDto object on successful signup', async () => {
      // INIT
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'pass',
        confirmPassword: 'pass',
      };
      const expectedUser = { id: 1, ...createUserDto };
      mockedAuthService.signup.mockResolvedValue(expectedUser);

      // RUN
      const result = await controller.signup(createUserDto);

      // CHECK RESULT
      expect(mockedAuthService.signup).toHaveBeenCalledWith(createUserDto);
      expect(result).toBeInstanceOf(UserDto);
    });
  });

  describe('login', () => {
    it('should return a transformed JwtDto object on successful login', async () => {
      // INIT
      const user = { username: 'test', password: 'pass' } as User;
      const token = 'jwt';
      mockedAuthService.login.mockResolvedValue({
        accessToken: token,
      });

      // RUN
      await controller.login(user, mockedResponse as Response);

      // CHECK RESULT
      expect(mockedAuthService.login).toHaveBeenCalledWith(user);
      expect(mockedResponse.cookie).toHaveBeenCalledWith('Authentication', token, expect.any(Object));
    });
  });

  describe('getProfile', () => {
    it('should return a transformed UserDto object', () => {
      // INIT
      const user = { id: 1, username: 'test' } as User;

      // RUN
      const result = controller.getProfile(user);

      // CHECK RESULT
      expect(result).toBeInstanceOf(UserDto);
    });
  });
});
