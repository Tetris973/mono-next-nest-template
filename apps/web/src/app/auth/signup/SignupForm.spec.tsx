import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from './SignupForm';
import { mockToast } from '@web/app/utils/test/mock-toast.utils';
import { mockRouter } from '@web/app/utils/test/mock-router.utils';

describe('SignupForm', () => {
  const mockUseSignupProps = {
    error: {},
    showPassword: false,
    setShowPassword: vi.fn(),
    handleSubmit: vi.fn(),
    signupPending: false,
  };
  const mockUseSignup = () => mockUseSignupProps;

  const defaultProps = {
    useSignup: mockUseSignup,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username, password, and confirm password fields', () => {
    render(<SignupForm {...defaultProps} />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('displays loading state when signupPending is true', () => {
    // INIT
    const loadingMockUseSignup = () => ({
      ...mockUseSignup(),
      signupPending: true,
    });

    // RUN
    render(<SignupForm useSignup={loadingMockUseSignup} />);

    // CHECK RESULTS
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Sign up/i }).querySelector('.chakra-spinner')).toBeInTheDocument();
    expect(screen.getAllByTestId('field-skeleton-loader')).toHaveLength(3);
  });

  it('calls handleSubmit when form is submitted', async () => {
    // INIT
    mockUseSignupProps.handleSubmit.mockResolvedValue({});

    // RUN
    render(<SignupForm {...defaultProps} />);

    // CHECK RESULTS
    const form = screen.getByRole('form', { name: /sign up/i });
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockUseSignupProps.handleSubmit).toHaveBeenCalled();
    });
  });

  it('displays error toast when form submission fails', async () => {
    // INIT
    const errorMessage = 'Signup failed';
    mockUseSignupProps.handleSubmit.mockResolvedValue({ error: errorMessage });

    // RUN
    render(<SignupForm {...defaultProps} />);

    // CHECK RESULTS
    const form = screen.getByRole('form', { name: /sign up/i });
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockToast.toastError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('displays success toast and redirects to login page when signup is successful', async () => {
    // INIT
    const successMessage = 'Signup successful';
    mockUseSignupProps.handleSubmit.mockResolvedValue({ success: successMessage });

    // RUN
    render(<SignupForm {...defaultProps} />);

    // CHECK RESULTS
    const form = screen.getByRole('form', { name: /sign up/i });
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockToast.toastSuccess).toHaveBeenCalledWith(successMessage);
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('toggles password visibility when show/hide password button is clicked', () => {
    // INIT
    render(<SignupForm {...defaultProps} />);

    // RUN
    const passwordInputs = screen.getAllByLabelText('Password');
    const toggleButtons = screen.getAllByLabelText('Toggle password visibility');

    passwordInputs.forEach((input) => {
      expect(input).toHaveAttribute('type', 'password');
    });
    toggleButtons.forEach((button) => {
      fireEvent.click(button);
    });
    expect(mockUseSignupProps.setShowPassword).toHaveBeenCalledWith(true);
    expect(mockUseSignupProps.setShowPassword).toHaveBeenCalledTimes(2);
  });

  it('displays multiple error messages when error object has values', () => {
    const errorMockUseSignup = () => ({
      ...mockUseSignup(),
      error: {
        username: ['Username error'],
        password: ['Password error'],
        confirmPassword: ['Confirm password error'],
      },
    });
    render(<SignupForm useSignup={errorMockUseSignup} />);
    expect(screen.getByText('Username error')).toBeInTheDocument();
    expect(screen.getByText('Password error')).toBeInTheDocument();
    expect(screen.getByText('Confirm password error')).toBeInTheDocument();
  });

  it('renders login link correctly', () => {
    render(<SignupForm {...defaultProps} />);
    const loginLink = screen.getByText('Login');
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
});
