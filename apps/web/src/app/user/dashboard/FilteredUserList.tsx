import { useState } from 'react';
import { UserDto } from '@web/lib/backend-api/index';
import { TextInput, List, Text, Box, ScrollArea, Loader } from '@mantine/core';
import classes from './FilteredUserList.module.css';

function SearchBar({ filter, setFilter }: { filter: string; setFilter: (filter: string) => void }) {
  return (
    <form>
      <TextInput
        mb="sm"
        placeholder="Filter users"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </form>
  );
}

function UserRow({
  user,
  isSelected,
  onUserSelect,
}: {
  user: UserDto;
  isSelected: boolean;
  onUserSelect: (id: number) => void;
}) {
  return (
    <List.Item
      className={classes.userRow}
      p="xs"
      pl={2}
      role="button"
      aria-pressed={isSelected}
      onClick={() => onUserSelect(user.id)}>
      <Text fw={isSelected ? 'bold' : 'normal'}>
        <Box
          component="span"
          fw="bold"
          mr={10}>
          {user.id}
        </Box>
        {user.username}
      </Text>
    </List.Item>
  );
}

function UserList({
  users,
  selectedUserId,
  onUserSelect,
}: {
  users: UserDto[];
  selectedUserId: number | undefined;
  onUserSelect: (id: number) => void;
}) {
  return (
    <ScrollArea className={classes.scrollableContainer}>
      <List listStyleType="none">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            isSelected={user.id === selectedUserId}
            onUserSelect={onUserSelect}
          />
        ))}
      </List>
    </ScrollArea>
  );
}

export interface FilteredUserListProps {
  users: UserDto[];
  selectedUserId: number | undefined;
  onUserSelect: (id: number) => void;
  isLoading: boolean;
  error: string | undefined;
}

export const FilteredUserList: React.FC<FilteredUserListProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  isLoading,
  error,
}) => {
  const [filterText, setFilterText] = useState('');

  const filteredUsers = users.filter((user) => user.username.includes(filterText));

  return (
    <Box
      w={400}
      maw="100%">
      <SearchBar
        filter={filterText}
        setFilter={setFilterText}
      />
      {isLoading && <Loader data-testid="user-list-loading" />}
      {error && (
        <Text
          c="red"
          role="alert">
          {error}
        </Text>
      )}
      {!isLoading && !error && (
        <UserList
          users={filteredUsers}
          selectedUserId={selectedUserId}
          onUserSelect={onUserSelect}
        />
      )}
    </Box>
  );
};
