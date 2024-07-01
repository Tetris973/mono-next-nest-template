import { useState, useEffect, CSSProperties } from 'react';
import { Box, Input, List, ListItem, Text, useColorModeValue, Spinner } from '@chakra-ui/react';
import { UserDto } from '@dto/user/dto/user.dto';

export interface UserListProps {
  users: UserDto[];
  loading: boolean;
  error: string | null;
  onUserSelect: (id: number) => void;
  containerStyle?: CSSProperties;
}

const renderLoading = () => <Spinner data-testid="user-list-loading" />;

const renderError = (error: string) => <Text color="red.500">{error}</Text>;

export const UserList: React.FC<UserListProps> = ({ users, loading, error, onUserSelect, containerStyle }) => {
  const [filter, setFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserDto[]>(users);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const bgHover = useColorModeValue('gray.100', 'gray.600');
  const bgSelected = useColorModeValue('gray.200', 'gray.600');
  const bg = useColorModeValue('gray.200', 'gray.600');

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
      <ListItem
        key={user.id}
        bg={isSelected ? bgSelected : 'transparent'}
        _hover={{ bg: isSelected ? bgSelected : bgHover }}
        p={2}
        cursor="pointer"
        onClick={() => handleUserSelect(user.id)}
        borderRadius="md"
        transition="background-color 0.2s">
        <Text fontWeight={isSelected ? 'bold' : 'normal'}>
          <Box
            as="span"
            fontWeight="bold"
            mr={2}>
            {user.id}
          </Box>
          {user.username}
        </Text>
      </ListItem>
    );
  };

  const renderUserList = () => <List spacing={3}>{filteredUsers.map(renderUserItem)}</List>;

  return (
    <Box
      w="40%"
      p={4}
      overflowY="auto"
      borderColor={bg}
      style={containerStyle}>
      <Input
        placeholder="Filter users"
        mb={4}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {loading && renderLoading()}
      {error && renderError(error)}
      {!loading && !error && renderUserList()}
    </Box>
  );
};
