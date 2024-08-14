import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';
import { UserDto } from '@dto/user/dto/user.dto';

describe('UserCard', () => {
  const mockUser: UserDto = {
    id: 1,
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const defaultProps = {
    user: mockUser,
    loading: false,
    onDelete: vi.fn(),
    showAdmin: false,
    onEdit: vi.fn(),
  };

  it('displays loading spinner when loading prop is true', () => {
    render(
      <UserCard
        {...defaultProps}
        loading={true}
      />,
    );
    expect(screen.getByTestId('user-card-loading')).toBeInTheDocument();
  });

  it('does not display loading spinner when loading prop is false', () => {
    render(
      <UserCard
        {...defaultProps}
        loading={false}
      />,
    );
    expect(screen.queryByTestId('user-card-loading')).not.toBeInTheDocument();
  });

  it('renders user information when user prop is provided', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(`ID: ${mockUser.id}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Updated At: ${mockUser.updatedAt.toLocaleDateString()}`, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Created At: ${mockUser.createdAt.toLocaleDateString()}`, { exact: false }),
    ).toBeInTheDocument();
  });

  it('render with empty user information when user prop is null', () => {
    render(
      <UserCard
        {...defaultProps}
        user={null}
      />,
    );
    expect(screen.getByText('ID:')).toBeInTheDocument();
    expect(screen.getByText('Created At:')).toBeInTheDocument();
    expect(screen.getByText('Updated At:')).toBeInTheDocument();
  });

  it('displays admin buttons when showAdmin prop is true', () => {
    render(
      <UserCard
        {...defaultProps}
        showAdmin={true}
      />,
    );
    expect(screen.getByLabelText('Delete user')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit user')).toBeInTheDocument();
  });

  it('does not display admin buttons when showAdmin prop is false', () => {
    render(
      <UserCard
        {...defaultProps}
        showAdmin={false}
      />,
    );
    expect(screen.queryByLabelText('Delete user')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit user')).not.toBeInTheDocument();
  });

  it('calls onDelete function when delete button is clicked', () => {
    render(
      <UserCard
        {...defaultProps}
        showAdmin={true}
      />,
    );
    const deleteButton = screen.getByLabelText('Delete user');
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it('calls onEdit function when edit button is clicked', () => {
    render(
      <UserCard
        {...defaultProps}
        showAdmin={true}
      />,
    );
    const editButton = screen.getByLabelText('Edit user');
    fireEvent.click(editButton);
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });
});
