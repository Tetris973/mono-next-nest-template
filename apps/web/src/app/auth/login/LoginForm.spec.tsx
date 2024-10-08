import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, renderHook } from '@webRoot/test/common/unit-test/helpers/index';
import { LoginForm } from './LoginForm';
import { useForm } from '@mantine/form';

describe('LoginForm', () => {
  const mockUseLoginProps = {
    form: renderHook(() =>
      useForm({
        initialValues: {
          username: '',
          password: '',
        },
      }),
    ).result.current,
    showPassword: false,
    setShowPassword: vi.fn(),
    handleSubmit: vi.fn(),
    authLoading: false,
  };
  const mockUseLogin = () => mockUseLoginProps;

  const defaultProps = {
    useLogin: mockUseLogin,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLoginProps.form.reset();
  });

  it('renders username and password fields', () => {
    render(<LoginForm {...defaultProps} />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('displays loading state when authLoading is true', () => {
    const loadingMockUseLogin = () => ({
      ...mockUseLogin(),
      authLoading: true,
    });
    render(<LoginForm useLogin={loadingMockUseLogin} />);
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Sign in/i })).toHaveAttribute('data-loading', 'true');
  });

  it('calls handleSubmit when form is submitted', async () => {
    // INIT
    mockUseLoginProps.handleSubmit.mockResolvedValue({});
    render(<LoginForm {...defaultProps} />);
    const form = screen.getByRole('form');

    // RUN
    fireEvent.submit(form);

    // CHECK RESULTS
    await waitFor(() => {
      expect(mockUseLoginProps.handleSubmit).toHaveBeenCalled();
    });
  });

  it('renders "Remember me" checkbox as disabled', () => {
    render(<LoginForm {...defaultProps} />);
    const rememberMeCheckbox = screen.getByLabelText('Remember me');
    expect(rememberMeCheckbox).toBeDisabled();
  });

  it('renders "Forgot password?" link as non-clickable', () => {
    render(<LoginForm {...defaultProps} />);
    const forgotPasswordLink = screen.getByText('Forgot password?');
    expect(forgotPasswordLink).toHaveStyle('cursor: not-allowed');
  });

  it('renders sign up link correctly', () => {
    render(<LoginForm {...defaultProps} />);
    const signUpLink = screen.getByText('Sign up');
    expect(signUpLink).toHaveAttribute('href', '/auth/signup');
  });
});
