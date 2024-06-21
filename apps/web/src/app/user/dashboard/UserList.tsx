import { useState, useEffect, CSSProperties } from 'react';
import { Box, Input, List, ListItem, Text, useColorModeValue, Spinner } from '@chakra-ui/react';
import { UserDto } from '@dto/user/dto/user.dto';

interface UserListProps {
  users: UserDto[];
  loading: boolean;
  error: string;
  onUserSelect: (id: number) => void;
  containerStyle?: CSSProperties;
}

export const UserList: React.FC<UserListProps> = ({ users, loading, error, onUserSelect, containerStyle }) => {
  const [filter, setFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserDto[]>(users);

  const bgHover = useColorModeValue('gray.100', 'gray.600');
  const bg = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(filter.toLowerCase())));
  }, [filter, users]);

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
      {loading && <Spinner />}
      {error && <Text color="red.500">{error}</Text>}
      {!loading && !error && (
        <List spacing={3}>
          {filteredUsers.map((user: UserDto) => (
            <ListItem
              key={user.id}
              _hover={{ bg: bgHover }}
              p={2}
              cursor="pointer"
              onClick={() => onUserSelect(user.id)}>
              <Text>
                <Box
                  as="span"
                  fontWeight="bold"
                  mr={2}>
                  {user.id}
                </Box>
                {user.username}
              </Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
