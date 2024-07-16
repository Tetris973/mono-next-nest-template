import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth, AuthProviderDependencies } from './AuthContext';
import { Role } from './role.enum';
import { mockRouter } from '@testWeb/utils/unit-test/mock-router.utils';

describe('AuthContext', () => {
  const mockLoginAction = vi.fn();
  const mockLogoutAction = vi.fn();
  const mockIsAuthenticatedAction = vi.fn();
  const mockGetRolesAction = vi.fn();

  const defaultDependencies: AuthProviderDependencies = {
    loginAction: mockLoginAction,
    logoutAction: mockLogoutAction,
    isAuthenticatedAction: mockIsAuthenticatedAction,
    getRolesAction: mockGetRolesAction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticatedAction.mockResolvedValue(false);
    mockGetRolesAction.mockResolvedValue([]);
  });

  const renderAuthHook = (deps: Partial<AuthProviderDependencies> = {}) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider
        {...defaultDependencies}
        {...deps}>
        {children}
      </AuthProvider>
    );
    return renderHook(() => useAuth(), { wrapper });
  };

  it('initializes isAuthenticated undefined', () => {
    const { result } = renderAuthHook();
    expect(result.current.isAuthenticated).toBeUndefined();
  });

  it('sets isAuthenticated and roles after initial load', async () => {
    // INIT
    mockIsAuthenticatedAction.mockResolvedValue(true);
    mockGetRolesAction.mockResolvedValue([Role.USER]);

    // RUN & CHECK RESULTS
    const { result } = renderAuthHook();
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.roles).toEqual([Role.USER]);
      expect(result.current.loading).toBe(false);
    });
  });

  it('handles login successfully', async () => {
    // INIT
    mockLoginAction.mockResolvedValue({ result: null });
    mockGetRolesAction.mockResolvedValue([Role.USER]);

    const { result } = renderAuthHook();
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });

    // RUN
    await act(async () => {
      await result.current.login({ username: 'testuser', password: 'password' });
    });

    // CHECK RESULTS
    expect(mockLoginAction).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.roles).toEqual([Role.USER]);
    expect(result.current.loading).toBe(false);
  });

  it('handles login failure', async () => {
    // INIT
    const loginError = { status: 401, message: 'Login failed' };
    mockLoginAction.mockResolvedValue({ error: loginError });

    const { result } = renderAuthHook();

    // RUN
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({ username: 'testuser', password: 'wrong' });
    });

    // CHECK RESULTS
    expect(mockLoginAction).toHaveBeenCalledWith({ username: 'testuser', password: 'wrong' });
    expect(loginResult).toEqual({ error: loginError });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.roles).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('handles logout', async () => {
    // INIT
    mockLoginAction.mockResolvedValue({ result: null });
    mockGetRolesAction.mockResolvedValue([Role.USER]);
    const { result } = renderAuthHook();

    // Login first, to verify that roles were deleted when logging out
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });

    // RUN
    await act(async () => {
      await result.current.logout();
    });

    // CHECK RESULTS
    expect(mockLogoutAction).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.roles).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('throws error when useAuth is used outside of AuthProvider', () => {
    // expect an error thrown
    const errorMessage = 'useAuth must be used within an AuthProvider';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrowError(errorMessage);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, expect.stringMatching(errorMessage), expect.any(Error));
  });
});
