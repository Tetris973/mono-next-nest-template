import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getUserByIdAction, updateUserAction, getAllUsersAction, deleteUserAction } from './user.service';
import { BACKEND_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { UserDto } from '@dto/user/dto/user.dto';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';
import { checkAuthentication } from '@web/app/utils/check-authentication.utils';

describe('user.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserByIdAction', () => {
    it('should return user data on successful fetch', async () => {
      // INIT
      const userId = 1;
      const mockToken = 'mockToken';
      const mockUser: UserDto = {
        id: userId,
        username: 'testUser',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: '',
      };
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockUser),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await getUserByIdAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ result: mockUser });
      expect(safeFetch).toHaveBeenCalledWith(`${BACKEND_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          Cookie: `Authentication=${mockToken}`,
        },
      });
    });

    it('should return error if response is not ok', async () => {
      // INIT
      const userId = 1;
      const mockToken = 'mockToken';
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.NOT_FOUND,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await getUserByIdAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.NOT_FOUND,
          message: 'Failed to fetch profile',
        },
      });
    });
  });

  describe('updateUserAction', () => {
    it('should return updated user data on successful update', async () => {
      // INIT
      const userId = 1;
      const mockToken = 'mockToken';
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      const mockUser: UserDto = {
        id: userId,
        username: 'updatedUser',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: '',
      };
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockUser),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ result: mockUser });
      expect(safeFetch).toHaveBeenCalledWith(`${BACKEND_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Cookie: `Authentication=${mockToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateUserDto),
      });
    });

    it('should return error if response is not ok, Conflict', async () => {
      // INIT
      const userId = 1;
      const mockToken = 'mockToken';
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.CONFLICT,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.CONFLICT,
          message: 'Username already exists',
        },
      });
    });

    it('should return error, if response is not ok, others', async () => {
      // INIT
      const userId = 1;
      const mockToken = 'mockToken';
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

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
      const mockToken = 'mockToken';
      const mockUsers: UserDto[] = [
        { id: 1, username: 'user1', createdAt: new Date(), updatedAt: new Date(), password: '' },
        { id: 2, username: 'user2', createdAt: new Date(), updatedAt: new Date(), password: '' },
      ];
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockUsers),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await getAllUsersAction();

      // CHECK RESULTS
      expect(result).toEqual({ result: mockUsers });
      expect(safeFetch).toHaveBeenCalledWith(`${BACKEND_URL}/users`, {
        method: 'GET',
        headers: {
          Cookie: `Authentication=${mockToken}`,
        },
      });
    });

    it('should return error if response is not ok', async () => {
      // INIT
      const mockToken = 'mockToken';
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

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
    it('should return null on successful delete', async () => {
      // INIT
      const userId = 1;
      const mockToken = 'mockToken';
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(null),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await deleteUserAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ result: null });
      expect(safeFetch).toHaveBeenCalledWith(`${BACKEND_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Cookie: `Authentication=${mockToken}`,
        },
      });
    });

    it('should return error if response is not ok', async () => {
      // INIT
      const userId = 1;
      const mockToken = 'mockToken';
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

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
