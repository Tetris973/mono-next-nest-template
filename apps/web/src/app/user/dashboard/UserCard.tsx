// app/dashboard/UserCard.tsx

import { Stack, Text, Box, Avatar, useColorModeValue, IconButton, Spinner } from '@chakra-ui/react';
import { User } from '@web/app/user/user.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

interface UserCardProps {
  user: User | null;
  loading: boolean;
  onDelete: () => void;
  showAdmin: boolean;
  onEdit: () => void;
}

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
      {loading && (
        <Spinner
          size="sm"
          position="absolute"
          top={4}
          left={4}
        />
      )}
      {user && showAdmin && (
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
      )}
      <Stack
        direction="column"
        alignItems="center"
        spacing={4}>
        <Avatar
          name={user?.username || ''}
          size="xl"
        />
        <Text
          fontSize="lg"
          fontWeight="bold">
          {user?.username || ''}
        </Text>
        <Text
          fontSize="sm"
          color="gray.500">
          ID: {user?.id || ''}
        </Text>
        <Text
          fontSize="sm"
          color="gray.500">
          Created At: {user ? new Date(user.createdAt).toLocaleString() : ''}
        </Text>
        <Text
          fontSize="sm"
          color="gray.500">
          Updated At: {user ? new Date(user.updatedAt).toLocaleString() : ''}
        </Text>
      </Stack>
    </Box>
  );
};
