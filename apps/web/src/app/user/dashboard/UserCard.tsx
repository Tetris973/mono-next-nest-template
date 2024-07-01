import { Stack, Text, Box, Avatar, useColorModeValue, IconButton, Spinner } from '@chakra-ui/react';
import { UserDto } from '@dto/user/dto/user.dto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

export interface UserCardProps {
  user: UserDto | null;
  loading: boolean;
  onDelete: () => void;
  showAdmin: boolean;
  onEdit: () => void;
}

const renderLoading = () => (
  <Spinner
    size="sm"
    position="absolute"
    top={4}
    left={4}
    data-testid="user-card-loading"
  />
);

const renderAdminButtons = (onDelete: () => void, onEdit: () => void) => (
  <>
    <IconButton
      aria-label="Delete user"
      icon={<FontAwesomeIcon icon={faTimes} />}
      size="sm"
      colorScheme="red"
      position="absolute"
      top={2}
      right={2}
      onClick={onDelete}
    />
    <IconButton
      aria-label="Edit user"
      icon={<FontAwesomeIcon icon={faEdit} />}
      size="sm"
      colorScheme="blue"
      position="absolute"
      top={2}
      right={12}
      onClick={onEdit}
    />
  </>
);

const renderUserInfo = (user: UserDto | null) => (
  <Stack
    direction="column"
    alignItems="center"
    spacing={4}>
    <Avatar
      name={user?.username}
      size="xl"
      data-testid="user-card-avatar"
    />
    <Text
      fontSize="lg"
      fontWeight="bold">
      {user?.username}
    </Text>
    <Text
      fontSize="sm"
      color="gray.500">
      ID: {user?.id}
    </Text>
    <Text
      fontSize="sm"
      color="gray.500">
      Created At: {user && new Date(user.createdAt).toLocaleString()}
    </Text>
    <Text
      fontSize="sm"
      color="gray.500">
      Updated At: {user && new Date(user.updatedAt).toLocaleString()}
    </Text>
  </Stack>
);

export const UserCard: React.FC<UserCardProps> = ({ user, loading, onDelete, showAdmin, onEdit }) => {
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Box
      position="relative"
      rounded={'xl'}
      bg={bg}
      boxShadow={'lg'}
      p={6}
      w={'full'}
      maxW={'md'}>
      {loading && renderLoading()}
      {user && showAdmin && renderAdminButtons(onDelete, onEdit)}
      {renderUserInfo(user)}
    </Box>
  );
};
