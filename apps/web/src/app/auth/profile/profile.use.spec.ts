import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor, SwrWrapper } from '@testWeb/common/unit-test/helpers/index';
import { useProfileForm, UseProfileFormDependencies } from './profile.use';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { mockUsers } from '@testWeb/common/unit-test/mocks/users.mock';

describe('useProfileForm', () => {
  const mockGetUserByIdAction = vi.fn();
  const mockUpdateUserAction = vi.fn();

  const dependencies: UseProfileFormDependencies = {
    getUserByIdAction: mockGetUserByIdAction,
    updateUserAction: mockUpdateUserAction,
  };

  const userId = mockUsers[0].id;
  const user = mockUsers[0];

  beforeEach(() => {
    mockGetUserByIdAction.mockReset();
    mockUpdateUserAction.mockReset();
  });

  it('should fetch user profile on mount', async () => {
    // INIT
    mockGetUserByIdAction.mockResolvedValue({ data: user });

    // RUN
    const { result } = renderHook(() => useProfileForm(userId, dependencies));

    // CHECK RESULTS
    await waitFor(() => {
      expect(result.current.user).toEqual(user);
    });
  });

  it('should handle form submission', async () => {
    // INIT
    const newUsername = 'newusername';
    const newUserData = { ...user, username: newUsername };
    mockGetUserByIdAction.mockResolvedValue({ data: user });
    mockUpdateUserAction.mockResolvedValue({ data: newUserData });
    const { result } = renderHook(() => useProfileForm(userId, dependencies), { wrapper: SwrWrapper });

    // Wait for the user to be set
    await waitFor(() => expect(result.current.user).toEqual(user));

    // After successful submit, the call to swr mutate will trigger a refetch of the user
    // So we need to change the mock to return the new data
    mockGetUserByIdAction.mockResolvedValue({ data: newUserData });

    // RUN & CHECK RESULTS
    // Submit form
    await act(async () => {
      const submitResult = await result.current.handleSubmit(newUserData);
      expect(submitResult).toEqual({ success: `Profile of ${newUsername} updated successfully` });
    });

    await waitFor(() => expect(result.current.user?.username).toEqual(newUserData.username));

    expect(result.current.profilePending).toBe(false);
  });

  it('should handle server errors, Conflict', async () => {
    // INIT
    mockGetUserByIdAction.mockResolvedValue({ data: user });
    const errorMessage = 'Username already taken';
    mockUpdateUserAction.mockResolvedValue({
      error: { status: HttpStatus.CONFLICT, message: errorMessage },
    });
    const { result } = renderHook(() => useProfileForm(userId, dependencies), { wrapper: SwrWrapper });

    // Wait for the user to be set
    await waitFor(() => expect(result.current.user).toEqual(user));

    // RUN
    await act(async () => {
      const submitResult = await result.current.handleSubmit(mockUsers[0]);
      expect(submitResult).toEqual({});
    });

    // CHECK RESULTS
    expect(result.current.form.errors.username).toEqual(errorMessage);
  });

  it('should handle server errors, other errors', async () => {
    // INIT
    mockGetUserByIdAction.mockResolvedValue({ data: user });
    const errorMessage = 'Service unavailable';
    mockUpdateUserAction.mockResolvedValue({
      error: { status: HttpStatus.SERVICE_UNAVAILABLE, message: errorMessage },
    });
    const { result } = renderHook(() => useProfileForm(userId, dependencies), { wrapper: SwrWrapper });

    // Wait for the user to be set
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(mockUsers[0]);
      expect(submitResult).toEqual({ error: errorMessage });
      expect(result.current.form.errors.username).toBeUndefined();
    });
  });
});
