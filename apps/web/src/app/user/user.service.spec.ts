import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getUserByIdAction, updateUserAction, getAllUsersAction, deleteUserAction } from './user.service';
import { getConfig } from '@web/config/configuration';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { UserDto, UpdateUserDto } from '@web/common/dto/backend-index.dto';
import { safeFetch } from '@web/common/helpers/safe-fetch.helpers';
import { checkAuthentication } from '@web/common/helpers/check-authentication.helpers';

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
      };
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockUser),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await getUserByIdAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ data: mockUser });
      expect(safeFetch).toHaveBeenCalledWith(`${getConfig().BACKEND_URL}/users/${userId}`, {
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
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.NOT_FOUND,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await getUserByIdAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.NOT_FOUND,
          message: 'Failed to fetch user',
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
      };
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockUser),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await updateUserAction(userId, updateUserDto);

      // CHECK RESULTS
      expect(result).toEqual({ data: mockUser });
      expect(safeFetch).toHaveBeenCalledWith(`${getConfig().BACKEND_URL}/users/${userId}`, {
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
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.CONFLICT,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

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
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

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
        { id: 1, username: 'user1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, username: 'user2', createdAt: new Date(), updatedAt: new Date() },
      ];
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockUsers),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await getAllUsersAction();

      // CHECK RESULTS
      expect(result).toEqual({ data: mockUsers });
      expect(safeFetch).toHaveBeenCalledWith(`${getConfig().BACKEND_URL}/users`, {
        method: 'GET',
        headers: {
          Cookie: `Authentication=${mockToken}`,
        },
      });
    });

    it('should return error if response is not ok', async () => {
      // INIT
      const mockToken = 'mockToken';
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

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
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(null),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await deleteUserAction(userId);

      // CHECK RESULTS
      expect(result).toEqual({ data: undefined });
      expect(safeFetch).toHaveBeenCalledWith(`${getConfig().BACKEND_URL}/users/${userId}`, {
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
      (checkAuthentication as Mock).mockReturnValue({ data: mockToken });
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

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
