import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin, UseLoginDependencies } from './login.hook';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { LoginUserDto } from '@web/common/dto/backend-index.dto';
import { mockRouter } from '@testWeb/common/unit-test/mocks/router.mock';
import { createFormElement } from '@testWeb/common/unit-test/helpers/create-form-element.helpers';

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
      expect(submitResult).toEqual({ success: 'Login successful' });
    });

    expect(mockAuth.login).toHaveBeenCalledWith(loginDto);
    expect(result.current.error).toEqual({ username: [], password: [] });
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

    expect(result.current.error).toEqual({
      username: ['You must provide a username.'],
      password: ['You must provide a password.'],
    });
  });

  it('should handle server errors, Errors set in error form state, Not Found', async () => {
    // INIT
    const details = { username: ['Username not found'] };
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.NOT_FOUND, message: 'Username not found' },
      data: details,
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
    expect(result.current.error).toEqual(details);
  });

  it('should handle server errors, Errors set in error state, Unauthorized', async () => {
    // INIT
    const details = { password: ['Incorrect password'] };
    mockAuth.login.mockResolvedValue({
      error: { status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
      data: details,
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
    expect(result.current.error).toEqual(details);
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
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        currentTarget: createFormElement(validCredentials),
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });
    expect(result.current.error).toEqual(details);
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

    expect(result.current.error).toEqual({ username: [], password: [] });
  });
});
