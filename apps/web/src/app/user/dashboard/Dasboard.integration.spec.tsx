import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { UserDto } from '@dto/user/dto/user.dto';
import { AuthContextInterface } from '@web/app/auth/AuthContext';
import { Role } from '@web/app/auth/role.enum';
import { UseDashboardDependencies, useDashboard } from './dashboard.use';
import { ProfileContextInterface } from '@web/app/auth/ProfileContext';
import { checkAuthentication } from '@web/app/utils/check-authentication.utils';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';

/**
 * Example of how an integration test would be done
 * Unfortunately, it's not possible to test the Dashboard component without mocking the checkAuthentication and safeFetch functions
 * because they are used by the useProfile hook, which is used by the ProfileForm component.
 *
 * We could add as props to the Dahboard component the useProfile hook and pass it to the ProfileForm.
 * But this could lead to explosion of number of mocking and to much boilerplate just for testing.
 *
 * The best approach seems to be to test the composed components such as Dashboard in e2e tests
 */
describe('Dashboard Integration', () => {
  const mockUsers: UserDto[] = [
    {
      id: 1,
      username: 'user1',
      createdAt: new Date('1990-01-02'),
      updatedAt: new Date('2000-11-22'),
      password: 'passpass',
    },
    {
      id: 2,
      username: 'user2',
      createdAt: new Date('1995-05-15'),
      updatedAt: new Date('2005-12-25'),
      password: 'no-password',
    },
  ];

  const mockAuthContext: AuthContextInterface = {
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: true,
    roles: [Role.ADMIN],
    loading: false,
  };

  const mockProfileContext: ProfileContextInterface = {
    profile: mockUsers[0],
    loading: false,
    loadProfile: vi.fn(),
  };

  const mockGetAllUsersAction = vi.fn();
  const mockGetUserByIdAction = vi.fn();
  const mockDeleteUserAction = vi.fn();

  const mockDependencies: UseDashboardDependencies = {
    useAuth: () => mockAuthContext,
    getAllUsersAction: mockGetAllUsersAction,
    getUserByIdAction: mockGetUserByIdAction,
    deleteUserAction: mockDeleteUserAction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllUsersAction.mockResolvedValue({ result: mockUsers });
    mockGetUserByIdAction.mockResolvedValue({ result: mockUsers[0] });
    mockDeleteUserAction.mockResolvedValue({ result: null });
  });

  it('renders user list and selected user details', async () => {
    render(
      <Dashboard
        useDashboard={() => useDashboard(mockDependencies)}
        useProfile={() => mockProfileContext}
      />,
    );

    // Wait for the user list to be rendered
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });

    // Click on a user
    fireEvent.click(screen.getByText('user1'));

    // Wait for user details to be rendered
    await waitFor(() => {
      expect(screen.getByLabelText('Delete user')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit user')).toBeInTheDocument();
      expect(screen.getByText(`${mockUsers[0].createdAt.toLocaleString()}`, { exact: false })).toBeInTheDocument();
    });
  });

  it('handles user deletion', async () => {
    render(
      <Dashboard
        useDashboard={() => useDashboard(mockDependencies)}
        useProfile={() => mockProfileContext}
      />,
    );

    // Wait for the user list to be rendered
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    // Click on a user
    fireEvent.click(screen.getByText('user1'));
    // Wait for user details to be rendered
    await waitFor(() => {
      expect(screen.getByLabelText('Delete user')).toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByLabelText('Delete user'));
    await waitFor(() => {
      expect(screen.getByText('Delete', { selector: 'button' })).toBeInTheDocument();
    });

    // Confirm deletion
    fireEvent.click(screen.getByText('Delete', { selector: 'button' }));

    // Wait for the deletion to be processed
    await waitFor(() => {
      expect(mockDeleteUserAction).toHaveBeenCalledWith(1);
      expect(mockGetAllUsersAction).toHaveBeenCalledTimes(1); // Initial load only, no reload after deletion
    });
  });

  it('handles user editing', async () => {
    render(
      <Dashboard
        useDashboard={() => useDashboard(mockDependencies)}
        useProfile={() => mockProfileContext}
      />,
    );

    // Wait for the user list to be rendered
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    // Click on a user
    fireEvent.click(screen.getByText('user1'));
    // Wait for user details to be rendered
    await waitFor(() => {
      expect(screen.getByLabelText('Edit user')).toBeInTheDocument();
    });

    // Click edit button
    // Mocking the checkAuthentication and safeFetch functions that are used by the useProfile hook, by the ProfileForm
    // This is were testing composed components such as Dashboard with mocking becomes a hasle and may benefit from being only e2e tests.
    const jwtToken = 'token';
    (checkAuthentication as Mock).mockReturnValue({ result: jwtToken });
    const responseMock = { result: { ok: true, json: () => Promise.resolve(mockUsers[0]) } };
    (safeFetch as Mock).mockResolvedValue(responseMock);

    fireEvent.click(screen.getByLabelText('Edit user'));

    // Check if ProfileForm is rendered
    await waitFor(() => {
      // Check if the submit and cancel buttons are rendered permit to know that the profile form is rendered
      expect(screen.getByLabelText('Submit profile changes')).toBeInTheDocument();
      expect(screen.getByLabelText('Cancel editing profile')).toBeInTheDocument();

      // We could test for the input fields here but we mocked the returned user from the server so verifying the data would be useless
    });
  });

  it('handles errors gracefully', async () => {
    const error = { status: 401, message: 'Failed to fetch users' };
    mockGetAllUsersAction.mockReturnValue({ error });

    render(
      <Dashboard
        useDashboard={() => useDashboard(mockDependencies)}
        useProfile={() => mockProfileContext}
      />,
    );

    // Wait for the error message to be rendered
    await waitFor(() => {
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });
  });
});
