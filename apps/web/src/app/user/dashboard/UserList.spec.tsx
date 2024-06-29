import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { UserList } from './UserList';
import { UserDto } from '@dto/user/dto/user.dto';

describe('UserList', () => {
  const mockUsers: UserDto[] = [
    { id: 1, username: 'user1', createdAt: new Date(), updatedAt: new Date(), password: 'password1' },
    { id: 2, username: 'user2', createdAt: new Date(), updatedAt: new Date(), password: 'password2' },
  ];

  const defaultProps = {
    users: mockUsers,
    loading: false,
    error: null,
    onUserSelect: vi.fn(),
  };

  it('renders correctly with all props provided', () => {
    render(<UserList {...defaultProps} />);
    expect(screen.getByTestId('user-list-container')).toBeInTheDocument();
  });

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
    expect(screen.getByTestId('user-list-error')).toHaveTextContent(errorMessage);
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
    const userList = screen.getByTestId('user-list');
    expect(userList).toBeInTheDocument();
    expect(within(userList).getAllByTestId(/^user-list-item-/)).toHaveLength(mockUsers.length);
  });

  it('renders empty list when users prop is an empty array', () => {
    render(
      <UserList
        {...defaultProps}
        users={[]}
      />,
    );
    const userList = screen.getByTestId('user-list');
    expect(userList).toBeInTheDocument();
    expect(within(userList).queryAllByTestId(/^user-list-item-/)).toHaveLength(0);
  });

  it('filters users correctly when typing in the filter input', () => {
    render(<UserList {...defaultProps} />);
    const filterInput = screen.getByTestId('user-list-filter-input');
    fireEvent.change(filterInput, { target: { value: mockUsers[0].username } });
    const userList = screen.getByTestId('user-list');
    expect(within(userList).getAllByTestId(/^user-list-item-/)).toHaveLength(1);
    expect(within(userList).getByTestId('user-list-item-1')).toHaveTextContent(mockUsers[0].username);
  });

  it('calls onUserSelect function and updates selected user when a user item is clicked', () => {
    render(<UserList {...defaultProps} />);
    const userItem = screen.getByTestId('user-list-item-1');
    fireEvent.click(userItem);
    expect(defaultProps.onUserSelect).toHaveBeenCalledWith(1);
  });

  it('displays correct user information for each user item', () => {
    render(<UserList {...defaultProps} />);
    mockUsers.forEach((user) => {
      const userItem = screen.getByTestId(`user-list-item-${user.id}`);
      expect(userItem).toHaveTextContent(user.id.toString());
      expect(userItem).toHaveTextContent(user.username);
    });
  });
});
