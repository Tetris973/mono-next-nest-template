import { Stack, Text, Box, Avatar, useColorModeValue, IconButton, Spinner } from '@chakra-ui/react';
import { UserDto } from '@dto/user/dto/user.dto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

interface UserCardProps {
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
      data-testid="user-card-delete-button"
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
      data-testid="user-card-edit-button"
    />
  </>
);

const renderUserInfo = (user: UserDto | null) => (
  <Stack
    direction="column"
    alignItems="center"
    spacing={4}
    data-testid="user-card-info">
    <Avatar
      name={user?.username}
      size="xl"
      data-testid="user-card-avatar"
    />
    <Text
      fontSize="lg"
      fontWeight="bold"
      data-testid="user-card-username">
      {user?.username}
    </Text>
    <Text
      fontSize="sm"
      color="gray.500"
      data-testid="user-card-id">
      ID: {user?.id}
    </Text>
    <Text
      fontSize="sm"
      color="gray.500"
      data-testid="user-card-created-at">
      Created At: {user && new Date(user.createdAt).toLocaleString()}
    </Text>
    <Text
      fontSize="sm"
      color="gray.500"
      data-testid="user-card-updated-at">
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
      maxW={'md'}
      data-testid="user-card">
      {loading && renderLoading()}
      {user && showAdmin && renderAdminButtons(onDelete, onEdit)}
      {renderUserInfo(user)}
    </Box>
  );
};
