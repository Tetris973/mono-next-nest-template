import { describe, beforeEach, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@server/user/dto/create-user.dto';
import { UserDto } from '@server/user/dto/user.dto';
import { JwtDto } from './dto/jwt.dto';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;

  const mockedAuthService = {
    signup: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      mockedAuthService.login.mockResolvedValue({
        accessToken: 'jwt',
      } as JwtDto);

      // RUN
      const result = await controller.login(user);

      // CHECK RESULT
      expect(mockedAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toBeInstanceOf(JwtDto);
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
