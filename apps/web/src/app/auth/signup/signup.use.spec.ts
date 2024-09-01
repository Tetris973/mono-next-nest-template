import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSignup, UseSignupDependencies } from './signup.use';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { CreateUserDto } from '@dto/modules/user/dto/create-user.dto';
import { mockRouter } from '@testWeb/common/unit-test/mocks/router.mock';
import { createFormElement } from '@testWeb/common/unit-test/helpers/create-form-element.helpers';

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
    expect(result.current.error).toEqual({ username: [], password: [], confirmPassword: [] });
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

    expect(result.current.error).toEqual({
      username: ['You must provide a username.'],
      password: ['You must provide a password.'],
      confirmPassword: [],
    });
  });

  it('should handle server errors, Errors set in error form state, Conflict', async () => {
    // INIT
    const usernameError = 'Username already exists';
    mockSignupAction.mockResolvedValue({
      error: {
        status: HttpStatus.CONFLICT,
        message: usernameError,
        details: { username: [usernameError] },
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
    expect(result.current.error).toEqual({ username: [usernameError] });
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
        details,
      },
    });

    const { result } = renderHook(() => useSignup(dependencies));

    // RUN & CHECK RESULTS
    await act(async () => {
      const submitResult = await result.current.handleSubmit({
        preventDefault: () => {},
        // input good crendentials to bypass client side validation
        currentTarget: createFormElement({
          username: 'testUser',
          password: 'Chocolat123!',
          confirmPassword: 'Chocolat123!',
        }),
      } as unknown as React.FormEvent<HTMLFormElement>);
      expect(submitResult).toEqual({});
    });

    expect(result.current.error).toEqual(details);
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

    expect(result.current.error).toEqual({ username: [], password: [], confirmPassword: [] });
  });
});
