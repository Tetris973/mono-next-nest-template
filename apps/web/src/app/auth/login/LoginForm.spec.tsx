import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { mockToast } from '@web/app/utils/test/mock-toast.utils';

describe('LoginForm', () => {
  const mockUseLoginProps = {
    error: {},
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
    expect(screen.getAllByTestId('field-skeleton-loader')).toHaveLength(2);
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

  it('displays error toast when form submission fails', async () => {
    // INIT
    const errorMessage = 'Login failed';
    mockUseLoginProps.handleSubmit.mockResolvedValue({ error: errorMessage });
    render(<LoginForm {...defaultProps} />);

    // RUN
    fireEvent.submit(screen.getByRole('form'));

    // CHECK RESULTS
    await waitFor(() => {
      expect(mockToast.toastError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('toggles password visibility when show/hide password button is clicked', () => {
    // INIT
    render(<LoginForm {...defaultProps} />);

    // RUN
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Toggle password visibility');

    // CHECK RESULTS
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(mockUseLoginProps.setShowPassword).toHaveBeenCalledWith(true);
  });

  it('displays multiple error messages when error object has values', () => {
    // INIT
    const errorMockUseLogin = () => ({
      ...mockUseLogin(),
      error: { username: ['Username error'], password: ['Password error'] },
    });

    // RUN
    render(<LoginForm useLogin={errorMockUseLogin} />);

    // CHECK RESULTS
    expect(screen.getByText('Username error')).toBeInTheDocument();
    expect(screen.getByText('Password error')).toBeInTheDocument();
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
