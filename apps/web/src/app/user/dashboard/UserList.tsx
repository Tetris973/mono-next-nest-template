import React, { useState, useEffect } from 'react';
import { Box, TextInput, List, Text, Loader, Paper, ScrollArea } from '@mantine/core';
import { UserDto } from '@dto/user/dto/user.dto';
import classes from './UserList.module.css';

export interface UserListProps {
  users: UserDto[];
  loading: boolean;
  error: string | null;
  onUserSelect: (id: number) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, loading, error, onUserSelect }) => {
  const [filter, setFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserDto[]>(users);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const lowercasedFilter = filter.toLowerCase();
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(lowercasedFilter)));
  }, [filter, users]);

  const handleUserSelect = (id: number) => {
    setSelectedUserId(id);
    onUserSelect(id);
  };

  const renderUserItem = (user: UserDto) => {
    const isSelected = user.id === selectedUserId;

    return (
      <Paper
        key={user.id}
        p="xs"
        onClick={() => handleUserSelect(user.id)}
        className={classes.userItem}
        data-selected={isSelected || undefined}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}>
        <Text fw={isSelected ? 'bold' : 'normal'}>
          <Box
            component="span"
            fw="bold"
            mr={10}>
            {user.id}
          </Box>
          {user.username}
        </Text>
      </Paper>
    );
  };

  const renderUserList = () => (
    <ScrollArea className={classes.scrollableContainer}>
      <List
        spacing="xs"
        role="listbox"
        aria-label="User list">
        {filteredUsers.map(renderUserItem)}
      </List>
    </ScrollArea>
  );

  return (
    <Box
      w={400}
      maw="100%">
      <TextInput
        placeholder="Filter users"
        value={filter}
        onChange={(event) => setFilter(event.currentTarget.value)}
        mb="md"
        aria-label="Filter users"
      />
      {loading && <Loader data-testid="user-list-loading" />}
      {error && (
        <Text
          c="red"
          role="alert">
          {error}
        </Text>
      )}
      {!loading && !error && renderUserList()}
    </Box>
  );
};
