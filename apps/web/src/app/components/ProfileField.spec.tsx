import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testWeb/utils/unit-test/index';
import { ProfileField } from './ProfileField';

describe('ProfileField', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Label',
    name: 'test-field',
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

  it('handles onChange event correctly', () => {
    render(<ProfileField {...defaultProps} />);
    const input = screen.getByDisplayValue(defaultProps.value);
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});
