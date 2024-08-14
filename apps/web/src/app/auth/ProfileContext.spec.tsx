import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ProfileProvider, useProfile, ProfileProviderDependencies } from './ProfileContext';
import { UserDto } from '@dto/user/dto/user.dto';

describe('ProfileContext', () => {
  const mockGetProfileAction = vi.fn();
  const mockUseAuth = vi.fn();

  const mockUser: UserDto = {
    id: 1,
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const defaultDependencies: ProfileProviderDependencies = {
    getProfileAction: mockGetProfileAction,
    useAuth: mockUseAuth,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    // mock to throw error
    mockGetProfileAction.mockImplementation(() => {
      throw new Error('resolved value was not mocked in specific test');
    });
  });

  const renderProfileHook = (deps: Partial<ProfileProviderDependencies> = {}) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProfileProvider
        {...defaultDependencies}
        {...deps}>
        {children}
      </ProfileProvider>
    );
    return renderHook(() => useProfile(), { wrapper });
  };

  it('initializes with null profile and loading false', () => {
    mockGetProfileAction.mockResolvedValue({ error: { message: 'not authenticated' } });
    const { result } = renderProfileHook();

    waitFor(() => {
      expect(result.current.profile).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('loads profile when authenticated', async () => {
    // INIT
    mockGetProfileAction.mockResolvedValue({ result: mockUser });
    const { result } = renderProfileHook();

    // RUN
    await act(async () => {
      await result.current.loadProfile();
    });

    // CHECK RESULTS
    expect(result.current.profile).toEqual(mockUser);
  });

  it('sets profile to null when not authenticated', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    const { result } = renderProfileHook();

    await waitFor(() => {
      expect(result.current.profile).toBeNull();
    });
  });

  it('handles profile loading error', async () => {
    // INIT
    const error = { message: 'Failed to load profile' };
    mockGetProfileAction.mockResolvedValue({ error });

    // RUN
    const { result } = renderProfileHook();

    // CHECK RESULTS
    await waitFor(() => {
      expect(result.current.profile).toBeNull();
    });
  });

  it('updates profile when loadProfile is called', async () => {
    // INIT
    mockGetProfileAction.mockResolvedValue({ result: mockUser });
    const { result } = renderProfileHook();

    // RUN
    await act(async () => {
      expect(result.current.profile).toBeNull();
      await result.current.loadProfile();
    });

    // CHECK RESULTS
    expect(mockGetProfileAction).toHaveBeenCalled();
    expect(result.current.profile).toEqual(mockUser);
  });

  it('throws error when useProfile is used outside of ProfileProvider', () => {
    const errorMessage = 'useProfile must be used within a ProfileProvider';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useProfile())).toThrowError(errorMessage);
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, expect.stringMatching(errorMessage), expect.any(Error));
  });
});
