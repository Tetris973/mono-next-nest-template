import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin, UseLoginDependencies } from './login.use';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';
import { mockRouter } from '@web/app/utils/test/mock-router.utils';
import { createFormElement } from '@web/app/utils/test/create-form-element';

describe('useLogin', () => {
  const mockAuth = {
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    isAuthenticated: false,
    roles: [],
  };

  const dependencies: UseLoginDependencies = {
    useAuth: () => mockAuth,
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
      useLogin({
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
    const loginDto: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
    mockAuth.login.mockResolvedValue({ result: null });
    const { result } = renderHook(() => useLogin(dependencies));

    // Create a mock form element
    const formElement = createFormElement({
      username: loginDto.username,
      password: loginDto.password,
    });

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: formElement,
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });

    expect(mockAuth.login).toHaveBeenCalledWith(loginDto);
    expect(result.current.error).toEqual({ username: '', password: '' });
  });

  it('should handle validation errors', async () => {
    // INIT
    const { result } = renderHook(() => useLogin(dependencies));
    const emptyForm = createFormElement({ username: '', password: '' });

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
  });

  it('should handle server errors, Errors set in error form state, Not Found', async () => {
    // INIT
    const errorMessage = 'Username not found';
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.NOT_FOUND, message: errorMessage },
    });
    const formElement = createFormElement({
      username: 'testUser',
      password: 'Chocolat123!',
    });
    const { result } = renderHook(() => useLogin(dependencies));

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

  it('should handle server errors, Errors returned by submit, Unauthorized', async () => {
    // INIT
    const errorMessage = 'Unauthorized';
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.UNAUTHORIZED, message: errorMessage },
    });
    const formElement = createFormElement({
      username: 'testUser',
      password: 'Chocolat123!',
    });
    const { result } = renderHook(() => useLogin(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: formElement,
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });
    expect(result.current.error.password).toBe(errorMessage);
  });

  it('should handle server errors, Errors returned by submit, Service Unavailable', async () => {
    // INIT
    const errorMessage = 'Service unavailable';
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.SERVICE_UNAVAILABLE, message: errorMessage },
    });
    const { result } = renderHook(() => useLogin(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: createFormElement({
          username: 'testUser',
          password: 'Chocolat123!',
        }),
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({ error: errorMessage });
    });

    expect(result.current.error.username).toBe('');
    expect(result.current.error.password).toBe('');
  });
});
