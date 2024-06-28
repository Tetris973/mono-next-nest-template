import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { UserCard } from './UserCard';
import { UserDto } from '@dto/user/dto/user.dto';

describe('UserCard', () => {
  const mockUser: UserDto = {
    id: 1,
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: 'no-password',
  };

  const defaultProps = {
    user: mockUser,
    loading: false,
    onDelete: vi.fn(),
    showAdmin: false,
    onEdit: vi.fn(),
  };

  it('renders correctly with all props provided', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
  });

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
    const userInfo = screen.getByTestId('user-card-info');
    expect(within(userInfo).getByTestId('user-card-username')).toHaveTextContent(mockUser.username);
    expect(within(userInfo).getByTestId('user-card-id')).toHaveTextContent(`ID: ${mockUser.id}`);

    const createdAtElement = within(userInfo).getByTestId('user-card-created-at');
    expect(createdAtElement).toHaveTextContent('Created At:');
    expect(createdAtElement).toHaveTextContent(mockUser.createdAt.toLocaleDateString());

    const updatedAtElement = within(userInfo).getByTestId('user-card-updated-at');
    expect(updatedAtElement).toHaveTextContent('Updated At:');
    expect(updatedAtElement).toHaveTextContent(mockUser.updatedAt.toLocaleDateString());
  });

  it('render with empty user information when user prop is null', () => {
    render(
      <UserCard
        {...defaultProps}
        user={null}
      />,
    );
    expect(screen.getByTestId('user-card-info')).toBeInTheDocument();
    expect(screen.getByTestId('user-card-username')).toHaveTextContent('');
    expect(screen.getByTestId('user-card-id')).toHaveTextContent('ID:');
    expect(screen.getByTestId('user-card-created-at')).toHaveTextContent('Created At:');
    expect(screen.getByTestId('user-card-updated-at')).toHaveTextContent('Updated At:');
  });

  it('displays admin buttons when showAdmin prop is true', () => {
    render(
      <UserCard
        {...defaultProps}
        showAdmin={true}
      />,
    );
    expect(screen.getByTestId('user-card-delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('user-card-edit-button')).toBeInTheDocument();
  });

  it('does not display admin buttons when showAdmin prop is false', () => {
    render(
      <UserCard
        {...defaultProps}
        showAdmin={false}
      />,
    );
    expect(screen.queryByTestId('user-card-delete-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-card-edit-button')).not.toBeInTheDocument();
  });

  it('calls onDelete function when delete button is clicked', () => {
    render(
      <UserCard
        {...defaultProps}
        showAdmin={true}
      />,
    );
    const deleteButton = screen.getByTestId('user-card-delete-button');
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
    const editButton = screen.getByTestId('user-card-edit-button');
    fireEvent.click(editButton);
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });
});
