import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfileForm, UseProfileFormDependencies } from './profile.use';
import { UserDto } from '@dto/user/dto/user.dto';
import { HttpStatus } from '@web/app/common/http-status.enum';

describe('useProfileForm', () => {
  const mockGetUserByIdAction = vi.fn();
  const mockUpdateUserAction = vi.fn();

  const dependencies: UseProfileFormDependencies = {
    getUserByIdAction: mockGetUserByIdAction,
    updateUserAction: mockUpdateUserAction,
  };

  const userId = 1;
  const user: UserDto = {
    id: userId,
    username: 'testUser',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockGetUserByIdAction.mockReset();
    mockUpdateUserAction.mockReset();
  });

  it('should fetch user profile on mount', async () => {
    // INIT
    mockGetUserByIdAction.mockResolvedValue({ result: user });

    // RUN
    const { result } = renderHook(() => useProfileForm(userId, dependencies));

    // CHECK RESULTS
    await waitFor(() => {
      expect(result.current.user).toEqual(user);
      expect(result.current.newUsername).toBe(user.username);
    });
  });

  it('should handle form submission', async () => {
    // INIT
    const newUsername = 'newusername';
    const newUserData = { ...user, username: newUsername };
    mockGetUserByIdAction.mockResolvedValue({ result: user });
    mockUpdateUserAction.mockResolvedValue({ result: newUserData });
    const { result } = renderHook(() => useProfileForm(userId, dependencies));

    // Wait for the user to be set
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // RUN & CHECK RESULTS
    // Input new user data
    await act(() => {
      result.current.setNewUsername(newUsername);
    });

    // Submit form
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({ success: `Profile of ${newUsername} updated successfully` });
    });

    expect(result.current.user?.username).toBe(newUsername);
    expect(result.current.profilePending).toBe(false);
    expect(result.current.profileError).toEqual({ username: [] });
  });

  it('should handle validation errors and remove them after successful submission', async () => {
    // INIT
    mockGetUserByIdAction.mockResolvedValue({ result: user });
    const { result } = renderHook(() => useProfileForm(userId, dependencies));

    // Wait for the user to be set
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // Input empty username
    await act(() => {
      result.current.setNewUsername('');
    });

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });
    expect(result.current.profileError).toEqual({ username: ['You must provide a username.'] });

    // INIT - valid username
    const newUserData = { ...user, username: 'validusername' };
    mockUpdateUserAction.mockResolvedValue({ result: newUserData });
    const validUsername = 'validusername';
    await act(() => {
      result.current.setNewUsername(validUsername);
    });

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({ success: `Profile of ${validUsername} updated successfully` });
    });

    // Check that form errors are removed after successful submission
    expect(result.current.profileError).toEqual({ username: [] });
  });

  it('should handle server errors, Conflict', async () => {
    // INIT
    mockGetUserByIdAction.mockResolvedValue({ result: user });
    const errorMessage = 'Username already taken';
    mockUpdateUserAction.mockResolvedValue({
      error: { status: HttpStatus.CONFLICT, message: errorMessage },
    });
    const { result } = renderHook(() => useProfileForm(userId, dependencies));

    // Wait for the user to be set
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // RUN
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });

    // CHECK RESULTS
    expect(result.current.profileError).toEqual({ username: [errorMessage] });
  });

  it('should handle server errors, other errors', async () => {
    // INIT
    mockGetUserByIdAction.mockResolvedValue({ result: user });
    const errorMessage = 'Service unavailable';
    mockUpdateUserAction.mockResolvedValue({
      error: { status: HttpStatus.SERVICE_UNAVAILABLE, message: errorMessage },
    });
    const { result } = renderHook(() => useProfileForm(userId, dependencies));

    // Wait for the user to be set
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({ error: errorMessage });
      expect(result.current.profileError).toEqual({ username: [] });
    });
  });
});
