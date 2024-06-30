import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

describe('DeleteConfirmationDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  it('renders the dialog when isOpen is true with the correct content', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Delete User')).toBeInTheDocument();
    expect(screen.getByText("Are you sure? You can't undo this action afterwards.")).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render the dialog when isOpen is false', () => {
    render(
      <DeleteConfirmationDialog
        {...defaultProps}
        isOpen={false}
      />,
    );
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete button is clicked', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('sets the Cancel button as the least destructive ref', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />);
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveFocus();
  });
});
