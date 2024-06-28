import React from 'react';
import { it, expect, describe, beforeEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import { UsernameField } from './UsernameField';

describe('UsernameField', () => {
  const defaultProps = {
    id: 'username',
    label: 'Username',
    type: 'text',
    name: 'username',
    error: undefined,
    loading: false,
  };

  beforeEach(() => {
    cleanup();
  });

  it('should render the UsernameField component with required props', () => {
    render(<UsernameField {...defaultProps} />);

    expect(screen.getByTestId('username-field')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toHaveAttribute('type', 'text');
  });

  it('should display Skeleton when loading is true', () => {
    render(
      <UsernameField
        {...defaultProps}
        loading={true}
      />,
    );

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('should not display Skeleton when loading is false', () => {
    render(
      <UsernameField
        {...defaultProps}
        loading={false}
      />,
    );

    expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument();
  });

  it('should display all error messages when multiple errors are provided', () => {
    const errors = ['Username is required', 'Username must be at least 8 characters'];
    render(
      <UsernameField
        {...defaultProps}
        error={errors}
      />,
    );

    const errorContainer = screen.getByTestId('username-field');
    errors.forEach((errorMessage) => {
      expect(within(errorContainer).getByText(errorMessage, { exact: false })).toBeInTheDocument();
    });
  });

  it('should set FormControl isInvalid on username-input correctly based on error presence', () => {
    const { rerender } = render(
      <UsernameField
        {...defaultProps}
        error={undefined}
      />,
    );

    expect(screen.getByTestId('username-input')).not.toHaveAttribute('aria-invalid');

    rerender(
      <UsernameField
        {...defaultProps}
        error={['Error']}
      />,
    );

    expect(screen.getByTestId('username-input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should render the correct label', () => {
    render(<UsernameField {...defaultProps} />);

    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should set the correct input type', () => {
    render(
      <UsernameField
        {...defaultProps}
        type="email"
      />,
    );

    expect(screen.getByTestId('username-input')).toHaveAttribute('type', 'email');
  });
});
