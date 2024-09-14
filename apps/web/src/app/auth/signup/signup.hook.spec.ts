import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSignup, UseSignupDependencies } from './signup.hook';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { CreateUserDto } from '@web/lib/backend-api/index';
import { mockRouter } from '@testWeb/common/unit-test/mocks/router.mock';

describe('useSignup', () => {
  const mockAuth = {
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    isAuthenticated: false,
    roles: [],
  };

  const mockSignupAction = vi.fn();

  const dependencies: UseSignupDependencies = {
    useAuth: () => mockAuth,
    signupAction: mockSignupAction,
  };

  const signupDto: CreateUserDto = {
    username: 'testUser',
    password: 'Chocolat123!',
    confirmPassword: 'Chocolat123!',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect if already authenticated', async () => {
    // INIT
    renderHook(() =>
      useSignup({
        useAuth: () => ({
          ...mockAuth,
          isAuthenticated: true,
        }),
      }),
    );

    // CHECK RESULTS
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('should handle form submission', async () => {
    // INIT
    mockSignupAction.mockResolvedValue({ result: null });
    const { result } = renderHook(() => useSignup(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(signupDto);
      expect(submitResult).toEqual({ success: 'Signup successful' });
    });

    expect(mockSignupAction).toHaveBeenCalledWith(signupDto);
    expect(result.current.form.errors).toEqual({});
  });

  it('should handle server errors, Errors set in error form state, Conflict', async () => {
    // INIT
    const usernameError = 'Username already exists';
    mockSignupAction.mockResolvedValue({
      error: {
        status: HttpStatus.CONFLICT,
        message: usernameError,
      },
      data: { username: [usernameError] },
    });

    const { result } = renderHook(() => useSignup(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(signupDto);
      expect(submitResult).toEqual({});
    });
    expect(result.current.form.errors).toEqual({ username: [usernameError] });
  });

  it('should handle server errors, Errors returned by submit, Bad Request', async () => {
    // INIT
    const errorMessage = 'validation errors';
    const details: Record<keyof CreateUserDto, string[]> = {
      username: ['username error', 'username error 2'],
      password: ['password error', 'password error 2'],
      confirmPassword: ['confirmPassword error', 'confirmPassword error 2'],
    };
    mockSignupAction.mockResolvedValue({
      error: {
        status: HttpStatus.BAD_REQUEST,
        message: errorMessage,
      },
      data: details,
    });

    const { result } = renderHook(() => useSignup(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(signupDto);
      expect(submitResult).toEqual({});
    });

    expect(result.current.form.errors).toEqual(details);
  });

  it('should handle server errors, Errors returned by submit, other status', async () => {
    // INIT
    const errorMessage = 'Service unavailable';
    mockSignupAction.mockResolvedValue({
      error: {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: errorMessage,
      },
    });

    const { result } = renderHook(() => useSignup(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(signupDto);
      expect(submitResult).toEqual({ error: errorMessage });
    });

    expect(result.current.form.errors).toEqual({});
  });
});
