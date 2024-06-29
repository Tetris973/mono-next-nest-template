import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileField } from './ProfileField';

describe('ProfileField', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Label',
    value: 'Test Value',
    error: undefined,
    loading: false,
    onChange: vi.fn(),
  };

  it('renders correctly with all props provided', () => {
    render(<ProfileField {...defaultProps} />);
    const field = screen.getByText(defaultProps.label);
    expect(field).toBeInTheDocument();
    const input = screen.getByDisplayValue(defaultProps.value);
    expect(input).toBeInTheDocument();
  });

  it('displays the correct label', () => {
    render(<ProfileField {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders input field when not loading', () => {
    render(<ProfileField {...defaultProps} />);
    const input = screen.getByDisplayValue(defaultProps.value);
    expect(input).toBeInTheDocument();
  });

  it('renders skeleton loader when loading', () => {
    render(
      <ProfileField
        {...defaultProps}
        loading={true}
      />,
    );
    expect(screen.getByTestId('profile-field-skeleton')).toBeInTheDocument();
  });

  it('displays the correct value in the input field', () => {
    render(<ProfileField {...defaultProps} />);
    const input = screen.getByDisplayValue(defaultProps.value);
    expect(input).toHaveValue(defaultProps.value);
  });

  it('handles onChange event correctly', () => {
    render(<ProfileField {...defaultProps} />);
    const input = screen.getByDisplayValue(defaultProps.value);
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('handles multiple error messages and applies invalid state', () => {
    const errors = ['Error 1', 'Error 2'];
    render(
      <ProfileField
        {...defaultProps}
        error={errors}
      />,
    );

    // Check for invalid state
    const field = screen.getByText(defaultProps.label);
    expect(field).toHaveAttribute('data-invalid');

    // Check for error messages
    errors.forEach((error) => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  it('does not display error message or apply invalid state when no error is provided', () => {
    render(<ProfileField {...defaultProps} />);
    const field = screen.getByText(defaultProps.label);
    expect(field).not.toHaveAttribute('data-invalid');
  });

  it('applies readonly styles when isReadOnly is true', () => {
    render(
      <ProfileField
        {...defaultProps}
        isReadOnly={true}
      />,
    );
    const input = screen.getByDisplayValue(defaultProps.value);
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveStyle('cursor: not-allowed');
  });

  it('allows input when isReadOnly is false', () => {
    render(
      <ProfileField
        {...defaultProps}
        isReadOnly={false}
      />,
    );
    const input = screen.getByDisplayValue(defaultProps.value);
    expect(input).not.toHaveAttribute('readonly');
  });

  it('renders placeholder text correctly', () => {
    render(<ProfileField {...defaultProps} />);
    const input = screen.getByDisplayValue(defaultProps.value);
    expect(input).toHaveAttribute('placeholder', defaultProps.label);
  });
});
