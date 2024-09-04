import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, renderHook } from '@webRoot/test/common/unit-test/helpers/index';
import { SignupForm } from './SignupForm';
import { mockRouter } from '@testWeb/common/unit-test/mocks/router.mock';
import { useForm } from '@mantine/form';

describe('SignupForm', () => {
  const mockUseSignupProps = {
    form: renderHook(() =>
      useForm({
        initialValues: {
          username: '',
          password: '',
          confirmPassword: '',
        },
      }),
    ).result.current,
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
    mockUseSignupProps.form.reset();
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
    expect(screen.getByRole('button', { name: /Sign up/i })).toHaveAttribute('data-loading', 'true');
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
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('renders login link correctly', () => {
    render(<SignupForm {...defaultProps} />);
    const loginLink = screen.getByText('Login');
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
});
