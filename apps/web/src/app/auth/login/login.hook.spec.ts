import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin, UseLoginDependencies } from './login.hook';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { LoginUserDto } from '@web/common/dto/backend-index.dto';
import { mockRouter } from '@testWeb/common/unit-test/mocks/router.mock';

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
    mockAuth.login.mockResolvedValue(undefined);
    const { result } = renderHook(() => useLogin(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(loginDto);
      expect(submitResult).toEqual({ success: 'Login successful' });
    });

    expect(mockAuth.login).toHaveBeenCalledWith(loginDto);
  });

  it('should handle server errors, Errors set in error form state, Not Found', async () => {
    // INIT
    const loginDto: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
    const details = { username: ['Username not found'] };
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.NOT_FOUND, message: 'Username not found' },
      data: details,
    });
    const { result } = renderHook(() => useLogin(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(loginDto);
      expect(submitResult).toEqual({});
    });
    expect(result.current.form.errors).toEqual(details);
  });

  it('should handle server errors, Errors set in error state, Unauthorized', async () => {
    // INIT
    const loginDto: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
    const details = { password: ['Incorrect password'] };
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
      data: details,
    });
    const { result } = renderHook(() => useLogin(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(loginDto);
      expect(submitResult).toEqual({});
    });
    expect(result.current.form.errors).toEqual(details);
  });

  it('should handle server errors, Errors set in error state, Bad Request', async () => {
    // INIT
    const errorMessage = 'Password is not strong enough';
    // This enable to bypass the client side validation and receive the errors from the backend server
    // Usualy this case is not possible, unless the client manualy modify the web page
    const validCredentials = { username: 'testUser', password: 'Chocolat123!' };
    const details: Record<keyof LoginUserDto, string[]> = {
      username: ['username error', 'username error 2'],
      password: ['password error', 'password error 2'],
    };
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.BAD_REQUEST, message: errorMessage },
      data: details,
    });
    const { result } = renderHook(() => useLogin(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(validCredentials);
      expect(submitResult).toEqual({});
    });
    expect(result.current.form.errors).toEqual(details);
  });

  it('should handle server errors, Errors returned by submit, Service Unavailable', async () => {
    // INIT
    const loginDto: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
    const errorMessage = 'Service unavailable';
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.SERVICE_UNAVAILABLE, message: errorMessage },
    });
    const { result } = renderHook(() => useLogin(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit(loginDto);
      expect(submitResult).toEqual({ error: errorMessage });
    });

    expect(result.current.form.errors).toEqual({});
  });
});
