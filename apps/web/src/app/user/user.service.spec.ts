import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserByIdAction, updateUserAction, getAllUsersAction, deleteUserAction } from './user.service';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { backendApi, StandardizedApiError, ResponseError, UpdateUserDto, UserDto } from '@web/lib/backend-api/index';
import { ServerActionResponseErrorInfo } from '@webRoot/src/common/types/server-action-response.type';

describe('user.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserByIdAction', () => {
    it('should return user data on successful fetch', async () => {
      // INIT
      const userId = 1;
      const mockUser: UserDto = {
        id: userId,
        username: 'testUser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(backendApi).userControllerFindOne.mockResolvedValue(mockUser);

      // RUN
      const result = await getUserByIdAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ data: mockUser });
      expect(vi.mocked(backendApi).userControllerFindOne).toHaveBeenCalledWith({ id: userId.toString() });
    });

    it('should handle error fron StandardizedApiError and return message from the error to the UI', async () => {
      // INIT
      const userId = 1;
      const mockErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'common error message',
      };
      const mockError = new StandardizedApiError(mockErrorInfo);
      vi.mocked(backendApi).userControllerFindOne.mockRejectedValue(mockError);

      // RUN
      const result = await getUserByIdAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ error: mockErrorInfo });
    });

    it('should handle unhandled error and return a standard error message to the UI', async () => {
      // INIT
      const userId = 1;
      const mockError = new Error('Unhandled error');
      vi.mocked(backendApi).userControllerFindOne.mockRejectedValue(mockError);

      // RUN
      const result = await getUserByIdAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch user',
        },
      });
    });
  });

  describe('updateUserAction', () => {
    it('should return updated user data on successful update', async () => {
      // INIT
      const userId = 1;
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      const mockUser: UserDto = {
        id: userId,
        username: 'updatedUser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(backendApi).userControllerUpdate.mockResolvedValue(mockUser);

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ data: mockUser });
      expect(vi.mocked(backendApi).userControllerUpdate).toHaveBeenCalledWith({
        id: userId.toString(),
        updateUserDto,
      });
    });

    it('should handle error fron StandardizedApiError and return message from the error to the UI', async () => {
      // INIT
      const userId = 1;
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      const mockErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'common error message',
      };
      const mockError = new StandardizedApiError(mockErrorInfo);
      vi.mocked(backendApi).userControllerUpdate.mockRejectedValue(mockError);

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ error: mockErrorInfo });
    });

    it('should handle error from ResponseError, status CONFLICT, and return correct message to the UI', async () => {
      // INIT
      const userId = 1;
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };

      const response = {
        status: HttpStatus.CONFLICT,
      } as Response;
      const mockError = new ResponseError(response);
      vi.mocked(backendApi).userControllerUpdate.mockRejectedValue(mockError);

      const expectedErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.CONFLICT,
        message: 'Username already exists',
      };

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ error: expectedErrorInfo });
    });

    it('should handle error from ResponseError, status BAD_REQUEST, and return standard error message to the UI', async () => {
      // INIT
      const userId = 1;
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };

      const updateUserDtoValidationErrors = {
        username: ['Username is too short'],
      };

      const response = {
        status: HttpStatus.BAD_REQUEST,
        json: vi.fn().mockResolvedValue(updateUserDtoValidationErrors),
      } as unknown as Response;
      const mockError = new ResponseError(response);
      vi.mocked(backendApi).userControllerUpdate.mockRejectedValue(mockError);

      const expectedErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid user data',
      };

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ error: expectedErrorInfo, data: updateUserDtoValidationErrors });
    });

    it('should handle unhandled error and return a standard error message to the UI', async () => {
      // INIT
      const userId = 1;
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      const mockError = new Error('Unhandled error');
      vi.mocked(backendApi).userControllerUpdate.mockRejectedValue(mockError);

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update user',
        },
      });
    });
  });

  describe('getAllUsersAction', () => {
    it('should return all users on successful fetch', async () => {
      // INIT
      const mockUsers: UserDto[] = [
        { id: 1, username: 'user1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, username: 'user2', createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.mocked(backendApi).userControllerFindAll.mockResolvedValue(mockUsers);

      // RUN
      const result = await getAllUsersAction();

      // CHECK RESULTS
      expect(result).toEqual({ data: mockUsers });
      expect(vi.mocked(backendApi).userControllerFindAll).toHaveBeenCalled();
    });

    it('should handle error from StandardizedApiError and return standard error message to the UI', async () => {
      // INIT
      const mockErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'common error message',
      };
      const mockError = new StandardizedApiError(mockErrorInfo);
      vi.mocked(backendApi).userControllerFindAll.mockRejectedValue(mockError);

      // RUN
      const result = await getAllUsersAction();

      // CHECK RESULTS
      expect(result).toEqual({ error: mockErrorInfo });
    });

    it('should handle unhandled error and return a standard error message to the UI', async () => {
      // INIT
      const mockError = new Error('Unhandled error');
      vi.mocked(backendApi).userControllerFindAll.mockRejectedValue(mockError);

      // RUN
      const result = await getAllUsersAction();

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch users',
        },
      });
    });
  });

  describe('deleteUserAction', () => {
    it('should return undefined on successful delete', async () => {
      // INIT
      const userId = 1;
      vi.mocked(backendApi).userControllerRemove.mockResolvedValue(undefined);

      // RUN
      const result = await deleteUserAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ data: undefined });
      expect(vi.mocked(backendApi).userControllerRemove).toHaveBeenCalledWith({ id: userId.toString() });
    });

    it('should handle error from StandardizedApiError and return message from the error to the UI', async () => {
      // INIT
      const userId = 1;
      const mockErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to delete user',
      };
      const mockError = new StandardizedApiError(mockErrorInfo);
      vi.mocked(backendApi).userControllerRemove.mockRejectedValue(mockError);

      // RUN
      const result = await deleteUserAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ error: mockErrorInfo });
    });

    it('should handle unhandled error and return a standard error message to the UI', async () => {
      // INIT
      const userId = 1;
      const mockError = new Error('Unhandled error');
      vi.mocked(backendApi).userControllerRemove.mockRejectedValue(mockError);

      // RUN
      const result = await deleteUserAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete user',
        },
      });
    });
  });
});
