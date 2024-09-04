import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, renderHook } from '@webRoot/test/common/unit-test/helpers/index';
import { ProfileForm } from './ProfileForm';
import { UserDto } from '@web/common/dto/backend-index.dto';
import { useForm } from '@mantine/form';

describe('ProfileForm', () => {
  const mockUser: UserDto = {
    id: 1,
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(1), // different date is needed for test
  };

  const mockUseProfileProps = {
    user: mockUser,
    form: renderHook(() =>
      useForm({
        initialValues: {
          username: mockUser.username,
        },
      }),
    ).result.current,
    profilePending: false,
    submitPending: false,
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
    mockUseProfileProps.form.reset();
  });

  it('displays loading state and prevent submit when profilePending is true', () => {
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
    expect(screen.getByLabelText('Submit profile changes')).toBeDisabled();
  });

  it('renders ProfileAvatar, ProfileField for username, createdAt, UpdatedAt, component with correct props', () => {
    render(<ProfileForm {...defaultProps} />);

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
    expect(createdAtField).toBeDisabled();

    // Check updatedAt field
    const updatedAtLabel = screen.getByText('Updated At');
    expect(updatedAtLabel).toBeInTheDocument();
    const updatedAtField = screen.getByDisplayValue(mockUser.updatedAt.toLocaleString());
    expect(updatedAtField).toBeInTheDocument();
    expect(updatedAtField).toBeDisabled();
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

  it('calls onSubmitSuccesswhen form submission is successful', async () => {
    mockUseProfileProps.handleSubmit.mockResolvedValue({ success: 'Profile updated successfully' });
    render(<ProfileForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Submit profile changes'));
    await waitFor(() => {
      expect(defaultProps.onSubmitSuccess).toHaveBeenCalled();
    });
  });

  it('renders createdAt and updatedAt fields as read-only', () => {
    render(<ProfileForm {...defaultProps} />);
    expect(screen.getByDisplayValue(mockUser.createdAt.toLocaleString()).closest('input')).toBeDisabled();
    expect(screen.getByDisplayValue(mockUser.updatedAt.toLocaleString()).closest('input')).toBeDisabled();
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
    expect(screen.getByLabelText('Submit profile changes')).toHaveAttribute('data-loading');
  });
});
