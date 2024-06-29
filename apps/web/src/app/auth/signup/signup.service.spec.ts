import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { signupAction } from './signup.service';
import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';

describe('signup.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signupAction', () => {
    it('should return user data on successful signup', async () => {
      // INIT
      const createUserDto: CreateUserDto = {
        username: 'newUser',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const mockResponse = {
        ok: true,
        status: HttpStatus.CREATED,
        json: vi.fn().mockResolvedValue(createUserDto),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await signupAction(createUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ result: createUserDto });
      expect(safeFetch).toHaveBeenCalledWith(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserDto),
      });
    });

    it('should return error if user already exists', async () => {
      // INIT
      const createUserDto: CreateUserDto = {
        username: 'existingUser',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const mockResponse = {
        ok: false,
        status: HttpStatus.CONFLICT,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await signupAction(createUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
          details: { username: ['User already exists'] },
        },
      });
    });

    it('should return error on bad request', async () => {
      // INIT
      const createUserDto: CreateUserDto = {
        username: 'badUser',
        password: 'badPassword',
        confirmPassword: 'notSamePassword',
      };
      const mockErrorDetails = {
        username: ['Username is required'],
        password: ['Password is required'],
        confirmPassword: ['Passwords do not match'],
      };
      const mockResponse = {
        ok: false,
        status: HttpStatus.BAD_REQUEST,
        json: vi.fn().mockResolvedValue(mockErrorDetails),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await signupAction(createUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          message: 'Bad request',
          status: HttpStatus.BAD_REQUEST,
          details: mockErrorDetails,
        },
      });
    });

    it('should return error if response is not ok and not handled specifically', async () => {
      // INIT
      const createUserDto: CreateUserDto = {
        username: 'newUser',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await signupAction(createUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'Failed to sign up', status: HttpStatus.INTERNAL_SERVER_ERROR },
      });
    });
  });
});
