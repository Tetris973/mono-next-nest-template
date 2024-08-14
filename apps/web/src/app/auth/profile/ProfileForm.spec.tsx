import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from './ProfileForm';
import { UserDto } from '@dto/user/dto/user.dto';
import { mockToast } from '@testWeb/utils/unit-test/mock-toast.utils';

describe('ProfileForm', () => {
  const mockUser: UserDto = {
    id: 1,
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(1), // different date is needed for test
  };

  const mockUseProfileProps = {
    user: mockUser,
    profileError: {},
    newUsername: 'testuser',
    profilePending: false,
    submitPending: false,
    setNewUsername: vi.fn(),
    handleSubmit: vi.fn(),
  };
  const mockUseProfileForm = () => mockUseProfileProps;

  const defaultProps = {
    userId: 1,
    onCancel: vi.fn(),
    onSubmitSuccess: vi.fn(),
    useProfileForm: mockUseProfileForm,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state when profilePending is true', () => {
    // INIT
    const loadingMockUseProfileForm = () => ({
      ...mockUseProfileForm(),
      profilePending: true,
    });

    // RUN
    render(
      <ProfileForm
        {...defaultProps}
        useProfileForm={loadingMockUseProfileForm}
      />,
    );

    // CHECK RESULT there should be three skeleton test ids from the three fields
    expect(screen.getAllByTestId('profile-field-skeleton')).toHaveLength(3);
  });

  it('renders ProfileAvatar, ProfileField for username, createdAt, UpdatedAt, component with correct props', () => {
    render(<ProfileForm {...defaultProps} />);

    // Check ProfileAvatar
    expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();

    // Check username field
    const usernameLabel = screen.getByText('User name');
    expect(usernameLabel).toBeInTheDocument();
    const usernameField = screen.getByDisplayValue(mockUser.username);
    expect(usernameField).toBeInTheDocument();

    // Check createdAt field
    const createdAtLabel = screen.getByText('Created At');
    expect(createdAtLabel).toBeInTheDocument();
    const createdAtField = screen.getByDisplayValue(mockUser.createdAt.toLocaleString());
    expect(createdAtField).toBeInTheDocument();
    expect(createdAtField).toHaveAttribute('readonly');

    // Check updatedAt field
    const updatedAtLabel = screen.getByText('Updated At');
    expect(updatedAtLabel).toBeInTheDocument();
    const updatedAtField = screen.getByDisplayValue(mockUser.updatedAt.toLocaleString());
    expect(updatedAtField).toBeInTheDocument();
    expect(updatedAtField).toHaveAttribute('readonly');
  });

  it('calls setNewUsername when username input changes', () => {
    render(
      <ProfileForm
        {...defaultProps}
        useProfileForm={mockUseProfileForm}
      />,
    );
    const usernameInput = screen.getByDisplayValue(mockUser.username);
    fireEvent.change(usernameInput!, { target: { value: 'newusername' } });
    expect(mockUseProfileProps.setNewUsername).toHaveBeenCalledWith('newusername');
  });

  it('displays multiple error messages when profileError.username is set', () => {
    const errorMockUseProfileForm = () => ({
      ...mockUseProfileForm(),
      profileError: { username: ['Error 1', 'Error 2'] },
    });
    render(
      <ProfileForm
        {...defaultProps}
        useProfileForm={errorMockUseProfileForm}
      />,
    );
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
  });

  it('disables submit button when submitPending is true', () => {
    const pendingMockUseProfileForm = () => ({
      ...mockUseProfileForm(),
      submitPending: true,
    });
    render(
      <ProfileForm
        {...defaultProps}
        useProfileForm={pendingMockUseProfileForm}
      />,
    );
    expect(screen.getByLabelText('Submit profile changes')).toBeDisabled();
  });

  it('calls handleSubmit when submit button is clicked', () => {
    mockUseProfileProps.handleSubmit.mockResolvedValue({ success: 'Profile updated successfully' });
    render(<ProfileForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Submit profile changes'));
    expect(mockUseProfileProps.handleSubmit).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ProfileForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Cancel editing profile'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('calls onSubmitSuccess and display success toast when form submission is successful', async () => {
    mockUseProfileProps.handleSubmit.mockResolvedValue({ success: 'Profile updated successfully' });
    render(<ProfileForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Submit profile changes'));
    await waitFor(() => {
      expect(defaultProps.onSubmitSuccess).toHaveBeenCalled();
      expect(mockToast.toastSuccess).toHaveBeenCalledWith('Profile updated successfully');
    });
  });

  it('displays error toast when form submission fails', async () => {
    mockUseProfileProps.handleSubmit.mockResolvedValue({ error: 'Submission failed' });
    render(<ProfileForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Submit profile changes'));
    await waitFor(() => {
      expect(mockToast.toastError).toHaveBeenCalledWith('Submission failed');
    });
  });

  it('renders createdAt and updatedAt fields as read-only', () => {
    render(<ProfileForm {...defaultProps} />);
    expect(screen.getByDisplayValue(mockUser.createdAt.toLocaleString()).closest('input')).toHaveAttribute('readonly');
    expect(screen.getByDisplayValue(mockUser.updatedAt.toLocaleString()).closest('input')).toHaveAttribute('readonly');
  });

  it('renders spinner in submit button when submitPending is true', () => {
    const pendingMockUseProfileForm = () => ({
      ...mockUseProfileForm(),
      submitPending: true,
    });
    render(
      <ProfileForm
        {...defaultProps}
        useProfileForm={pendingMockUseProfileForm}
      />,
    );
    expect(screen.getByLabelText('Submit profile changes').querySelector('.chakra-spinner')).toBeInTheDocument();
  });
});
