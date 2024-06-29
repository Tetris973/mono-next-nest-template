import React from 'react';
import { it, expect, describe } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

  it('should render the UsernameField component with required props', () => {
    render(<UsernameField {...defaultProps} />);

    expect(screen.getByLabelText(defaultProps.label)).toBeInTheDocument();
    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute('type', 'text');
  });

  it('should display Skeleton when loading is true', () => {
    render(
      <UsernameField
        {...defaultProps}
        loading={true}
      />,
    );

    expect(screen.getByTestId('field-skeleton-loader')).toBeInTheDocument();
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

    const formControl = screen.getByRole('group');
    expect(formControl).toHaveAttribute('data-invalid');

    errors.forEach((errorMessage) => {
      const errorElement = within(formControl).getByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('should set FormControl isInvalid on username-input correctly based on error presence', () => {
    const { rerender } = render(
      <UsernameField
        {...defaultProps}
        error={undefined}
      />,
    );

    expect(screen.getByLabelText(defaultProps.label)).not.toHaveAttribute('aria-invalid');

    rerender(
      <UsernameField
        {...defaultProps}
        error={['Error']}
      />,
    );

    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute('aria-invalid', 'true');
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

    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute('type', 'email');
  });
});
