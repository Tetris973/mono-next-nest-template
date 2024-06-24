import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSignup, UseSignupDependencies } from './signup.use';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';
import { mockRouter } from '@web/app/utils/test/mock-router.utils';
import { createFormElement } from '@web/app/utils/test/create-form-element';

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

  vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
  }));

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
    const signupDto: CreateUserDto = {
      username: 'testUser',
      password: 'Chocolat123!',
      confirmPassword: 'Chocolat123!',
    };
    mockSignupAction.mockResolvedValue({ result: null });
    const { result } = renderHook(() => useSignup(dependencies));

    // Create a mock form element
    const formElement = createFormElement({
      username: signupDto.username,
      password: signupDto.password,
      confirmPassword: signupDto.confirmPassword,
    });

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: formElement,
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({ success: 'Signup successful' });
    });

    expect(mockSignupAction).toHaveBeenCalledWith(signupDto);
    expect(result.current.error).toEqual({ username: '', password: '', confirmPassword: '' });
  });

  it('should handle validation errors', async () => {
    // INIT
    const { result } = renderHook(() => useSignup(dependencies));
    const emptyForm = createFormElement({ username: '', password: '', confirmPassword: '' });

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: emptyForm,
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });

    expect(result.current.error.username).toBe('You must provide a username.');
    expect(result.current.error.password).toBe('You must provide a password.');
    expect(result.current.error.confirmPassword).toBe('');
  });

  it('should handle server errors, Errors set in error form state, Conflict', async () => {
    // INIT
    const errorMessage = 'Username already exists';
    mockSignupAction.mockResolvedValue({
      error: {
        status: HttpStatus.CONFLICT,
        message: errorMessage,
      },
    });

    const formElement = createFormElement({
      username: 'testUser',
      password: 'Chocolat123!',
      confirmPassword: 'Chocolat123!',
    });
    const { result } = renderHook(() => useSignup(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: formElement,
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });
    expect(result.current.error.username).toBe(errorMessage);
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
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: createFormElement({
          username: 'testUser',
          password: 'Chocolat123!',
          confirmPassword: 'Chocolat123!',
        }),
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({ error: errorMessage });
    });

    expect(result.current.error.username).toBe('');
    expect(result.current.error.password).toBe('');
    expect(result.current.error.confirmPassword).toBe('');
  });
});
