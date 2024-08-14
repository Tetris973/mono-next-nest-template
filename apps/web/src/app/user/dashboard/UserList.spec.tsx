import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserList } from './UserList';
import { UserDto } from '@dto/user/dto/user.dto';

describe('UserList', () => {
  const mockUsers: UserDto[] = [
    { id: 742983, username: 'user1', createdAt: new Date(), updatedAt: new Date() },
    { id: 2394829, username: 'user2', createdAt: new Date(), updatedAt: new Date() },
  ];

  const defaultProps = {
    users: mockUsers,
    loading: false,
    error: null,
    onUserSelect: vi.fn(),
  };

  it('displays loading spinner when loading prop is true', () => {
    render(
      <UserList
        {...defaultProps}
        loading={true}
      />,
    );
    expect(screen.getByTestId('user-list-loading')).toBeInTheDocument();
  });

  it('does not display loading spinner when loading prop is false', () => {
    render(
      <UserList
        {...defaultProps}
        loading={false}
      />,
    );
    expect(screen.queryByTestId('user-list-loading')).not.toBeInTheDocument();
  });

  it('renders error message when error prop is provided', () => {
    const errorMessage = 'Test error message';
    render(
      <UserList
        {...defaultProps}
        error={errorMessage}
      />,
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('does not render error message when error prop is null', () => {
    render(
      <UserList
        {...defaultProps}
        error={null}
      />,
    );
    expect(screen.queryByTestId('user-list-error')).not.toBeInTheDocument();
  });

  it('renders user list when users prop is provided and not empty', () => {
    render(<UserList {...defaultProps} />);
    // user-list testid not available as well as user-list-item
    expect(screen.getByText(mockUsers[0].id.toString())).toBeInTheDocument();
    expect(screen.getByText(mockUsers[0].username)).toBeInTheDocument();
    expect(screen.getByText(mockUsers[1].id.toString())).toBeInTheDocument();
    expect(screen.getByText(mockUsers[1].username)).toBeInTheDocument();
  });

  it('filters users correctly when typing in the filter input', () => {
    render(<UserList {...defaultProps} />);
    const filterInput = screen.getByPlaceholderText('Filter users');
    fireEvent.change(filterInput, { target: { value: mockUsers[0].username } });
    expect(screen.getByText(mockUsers[0].id.toString())).toBeInTheDocument();
    expect(screen.getByText(mockUsers[0].username)).toBeInTheDocument();
    expect(screen.queryByText(mockUsers[1].id.toString())).not.toBeInTheDocument();
    expect(screen.queryByText(mockUsers[1].username)).not.toBeInTheDocument();
  });

  it('calls onUserSelect function and updates selected user when a user item is clicked', () => {
    render(<UserList {...defaultProps} />);
    const userItemText = screen.getByText(mockUsers[0].username);
    const userItem = userItemText.closest('li');

    fireEvent.click(userItem!);
    expect(defaultProps.onUserSelect).toHaveBeenCalledWith(mockUsers[0].id);
  });
});
