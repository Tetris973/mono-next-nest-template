import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { mockRouter } from '@web/app/utils/test/mock-router.utils';
import { UserDto } from '@dto/user/dto/user.dto';

describe('Header', () => {
  const mockLogout = vi.fn();
  const mockLoadProfile = vi.fn();

  const mockAuthContext = {
    login: vi.fn(),
    logout: mockLogout,
    isAuthenticated: false,
    roles: [],
    loading: false,
  };

  const mockProfile: UserDto = {
    id: 1,
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: 'password',
  };

  const mockProfileContext = {
    profile: mockProfile,
    loading: false,
    loadProfile: mockLoadProfile,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app name and home button', () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => mockProfileContext}
      />,
    );
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('navigates to home page when home button is clicked', () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => mockProfileContext}
      />,
    );
    fireEvent.click(screen.getByText('My App'));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('renders signup button when user is not authenticated and navigates to signup page when clicked', () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => ({ ...mockProfileContext, profile: null })}
      />,
    );
    expect(screen.getByText('Signup')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Signup'));
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/signup');
  });

  it('renders user menu when user is authenticated', () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => mockProfileContext}
      />,
    );
    expect(screen.getByRole('button', { name: mockProfile.username })).toBeInTheDocument();
  });

  it('renders profile and logout options in user menu when authenticated', async () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => mockProfileContext}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: mockProfile.username }));

    expect(await screen.findByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('navigates to profile page when profile option is clicked', async () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => mockProfileContext}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: mockProfile.username }));
    fireEvent.click(await screen.findByText('Profile'));

    expect(mockRouter.push).toHaveBeenCalledWith('/auth/profile');
  });

  it('calls logout function when logout option is clicked', async () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => mockProfileContext}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: mockProfile.username }));
    fireEvent.click(await screen.findByText('Logout'));

    expect(mockLogout).toHaveBeenCalled();
  });

  it('renders spinner when profile is loading', () => {
    render(
      <Header
        useAuth={() => mockAuthContext}
        useProfile={() => ({ ...mockProfileContext, profile: null, loading: true })}
      />,
    );
    expect(screen.getByTestId('header-loading-spinner')).toBeInTheDocument();
  });
});
