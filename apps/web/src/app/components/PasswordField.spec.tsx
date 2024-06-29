import React from 'react';
import { it, expect, vi, describe } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  const defaultProps = {
    id: 'password',
    label: 'Password',
    name: 'password',
    error: undefined,
    loading: false,
    showPassword: false,
    setShowPassword: vi.fn(),
  };

  it('should render the PasswordField component with required props', () => {
    // INIT
    render(<PasswordField {...defaultProps} />);

    // CHECK RESULTS
    const input = screen.getByLabelText(defaultProps.label);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should display Skeleton when loading is true', () => {
    // INIT
    render(
      <PasswordField
        {...defaultProps}
        loading={true}
      />,
    );

    // CHECK RESULTS
    expect(screen.getByTestId('field-skeleton-loader')).toBeInTheDocument();
  });

  it('should not display Skeleton when loading is false', () => {
    // INIT
    render(
      <PasswordField
        {...defaultProps}
        loading={false}
      />,
    );

    // CHECK RESULTS
    expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument();
  });

  it('should toggle password visibility when button is clicked', () => {
    // INIT
    const { rerender } = render(
      <PasswordField
        {...defaultProps}
        showPassword={false}
      />,
    );

    // RUN
    const button = screen.getByRole('button', { name: 'Toggle password visibility' });
    fireEvent.click(button);

    // CHECK RESULTS
    expect(defaultProps.setShowPassword).toHaveBeenCalledWith(true);
    const input = screen.getByLabelText(defaultProps.label);
    expect(input).toHaveAttribute('type', 'password');

    // RUN for toggle off
    rerender(
      <PasswordField
        {...defaultProps}
        showPassword={true}
      />,
    );
    fireEvent.click(button);

    // CHECK RESULTS
    expect(defaultProps.setShowPassword).toHaveBeenCalledWith(false);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should display the correct icon based on showPassword state', () => {
    // INIT with showPassword false
    const { rerender } = render(
      <PasswordField
        {...defaultProps}
        showPassword={false}
      />,
    );

    // CHECK RESULTS
    expect(screen.getByTestId('eye-slash-icon')).toBeInTheDocument();

    // RUN with showPassword true
    rerender(
      <PasswordField
        {...defaultProps}
        showPassword={true}
      />,
    );

    // CHECK RESULTS
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('should display all error messages within the FormControl when errors are provided', () => {
    // INIT
    const errors = ['Password is required', 'Password must be at least 8 characters'];
    render(
      <PasswordField
        {...defaultProps}
        error={errors}
      />,
    );

    // CHECK RESULTS
    const formControl = screen.getByRole('group');
    expect(formControl).toHaveAttribute('data-invalid');

    errors.forEach((errorMessage) => {
      const errorElement = within(formControl).getByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('should set FormControl isInvalid on password-input correctly based on error presence', () => {
    // INIT
    const { rerender } = render(
      <PasswordField
        {...defaultProps}
        error={undefined}
      />,
    );

    // CHECK RESULTS
    expect(screen.getByLabelText(defaultProps.label)).not.toHaveAttribute('aria-invalid');

    // RUN
    rerender(
      <PasswordField
        {...defaultProps}
        error={['Error']}
      />,
    );

    // CHECK RESULTS
    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute('aria-invalid', 'true');
  });
});
