import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signupAction } from './signup.service';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { ServerActionResponseErrorInfo } from '@web/common/types/server-action-response.type';
import { backendApi, StandardizedApiError, ResponseError, UserDto, CreateUserDto } from '@web/lib/backend-api/index';

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
      const mockUser: UserDto = {
        id: 1,
        username: createUserDto.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(backendApi).authControllerSignup.mockResolvedValue(mockUser);

      // RUN
      const result = await signupAction(createUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ data: mockUser });
      expect(backendApi.authControllerSignup).toHaveBeenCalledWith({ createUserDto });
    });

    it('should handle StandardizedApiError and return error info', async () => {
      // INIT
      const fakeCreateUserDto = {} as CreateUserDto;
      const mockErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
      const mockError = new StandardizedApiError(mockErrorInfo);
      vi.mocked(backendApi).authControllerSignup.mockRejectedValue(mockError);

      // RUN
      const result = await signupAction(fakeCreateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ error: mockErrorInfo });
    });

    it('should return error if user already exists', async () => {
      // INIT
      const fakeCreateUserDto = {} as CreateUserDto;
      const mockError = new ResponseError(new Response(JSON.stringify({}), { status: HttpStatus.CONFLICT }));
      vi.mocked(backendApi).authControllerSignup.mockRejectedValue(mockError);

      // RUN
      const result = await signupAction(fakeCreateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.CONFLICT,
          message: 'User already exists',
        },
        data: { username: ['User already exists'] },
      });
    });

    it('should return correct message error on BAD_REQUEST', async () => {
      // INIT
      const fakeCreateUserDto = {} as CreateUserDto;
      const mockErrorDetails = {
        username: ['Username is required'],
        password: ['Password is required'],
        confirmPassword: ['Passwords do not match'],
      };
      const mockError = new ResponseError(
        new Response(JSON.stringify(mockErrorDetails), { status: HttpStatus.BAD_REQUEST }),
      );
      vi.mocked(backendApi).authControllerSignup.mockRejectedValue(mockError);

      // RUN
      const result = await signupAction(fakeCreateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid user data',
        },
        data: mockErrorDetails,
      });
    });

    it('should handle unhandled errors and return a standard error message', async () => {
      // INIT
      const fakeCreateUserDto = {} as CreateUserDto;
      const mockError = new Error('Unhandled error');
      vi.mocked(backendApi).authControllerSignup.mockRejectedValue(mockError);

      // RUN
      const result = await signupAction(fakeCreateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to sign up',
        },
      });
    });
  });
});
