import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDashboard, UseDashboardDependencies } from './dashboard.hook';
import { UserDto } from '@web/common/dto/backend-index.dto';
import { Role } from '@web/app/auth/role.enum';

describe('useDashboard', () => {
  const mockAuth = {
    roles: [Role.USER],
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    isAuthenticated: false,
  };

  const mockGetAllUsersAction = vi.fn();
  const mockGetUserByIdAction = vi.fn();
  const mockDeleteUserAction = vi.fn();

  const dependencies: UseDashboardDependencies = {
    useAuth: () => mockAuth,
    getAllUsersAction: mockGetAllUsersAction,
    getUserByIdAction: mockGetUserByIdAction,
    deleteUserAction: mockDeleteUserAction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load users on mount', async () => {
    // INIT
    const users: UserDto[] = [{ id: 1, username: 'user1', createdAt: new Date(), updatedAt: new Date() }];
    mockGetAllUsersAction.mockResolvedValue({ data: users });
    const { result } = renderHook(() => useDashboard(dependencies));

    // CHECK RESULTS
    await waitFor(() => {
      expect(result.current.users).toEqual(users);
    });
  });

  it('should set showAdmin based on roles, admin and other', async () => {
    // INIT
    const { result, rerender } = renderHook(() => useDashboard(dependencies));

    // CHECK RESULTS
    expect(result.current.showAdmin).toBe(false);

    // Change roles to include ADMIN
    mockAuth.roles = [Role.ADMIN];
    rerender();

    await waitFor(() => {
      expect(result.current.showAdmin).toBe(true);
    });
  });

  describe('loadUserById', () => {
    it('should handle loadUserById', async () => {
      // INIT
      const user: UserDto = {
        id: 1,
        username: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGetUserByIdAction.mockResolvedValue({ data: user });
      const { result } = renderHook(() => useDashboard(dependencies));

      // RUN & CHECK RESULTS
      await act(async () => {
        await result.current.loadUserById(1);
      });
      // The selected user should be the laoded user
      expect(result.current.selectedUser).toEqual(user);
    });

    it('should handle errors from getUserByIdAction', async () => {
      // INIT
      const errorMessage = 'Failed to load user';
      mockGetUserByIdAction.mockResolvedValue({ error: { message: errorMessage } });
      const { result } = renderHook(() => useDashboard(dependencies));

      // RUN & CHECK RESULTS
      await act(async () => {
        const error = await result.current.loadUserById(1);
        expect(error).toBe(errorMessage);
      });
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('loadUsers', () => {
    it('should handle errors from getAllUsersAction', async () => {
      // INIT
      const errorMessage = 'Failed to load users';
      mockGetAllUsersAction.mockResolvedValue({ error: { message: errorMessage } });
      const { result } = renderHook(() => useDashboard(dependencies));

      // CHECK RESULTS
      await act(async () => {
        const error = await result.current.loadUsers();
        expect(error).toBe(errorMessage);
      });
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('deleteUser', () => {
    it('should handle deleteUser', async () => {
      // INIT
      const users: UserDto[] = [{ id: 1, username: 'user1', createdAt: new Date(), updatedAt: new Date() }];
      mockGetAllUsersAction.mockResolvedValue({ data: users });
      mockDeleteUserAction.mockResolvedValue({});
      const { result } = renderHook(() => useDashboard(dependencies));

      // Load users first
      await waitFor(() => {
        expect(result.current.users).toEqual(users);
      });

      // RUN & CHECK RESULTS
      await act(async () => {
        await result.current.deleteUser(1);
      });
      expect(result.current.users).toEqual([]);
      expect(result.current.selectedUser).toBeNull();
      expect(mockDeleteUserAction).toHaveBeenCalledWith(1);
    });

    it('should handle errors from deleteUserAction', async () => {
      // INIT
      const errorMessage = 'Failed to delete user';
      mockDeleteUserAction.mockResolvedValue({ error: { message: errorMessage } });
      const { result } = renderHook(() => useDashboard(dependencies));

      // RUN & CHECK RESULTS
      await act(async () => {
        const error = await result.current.deleteUser(1);
        expect(error).toBe(errorMessage);
      });
      expect(result.current.error).toBe(errorMessage);
    });
  });
});
