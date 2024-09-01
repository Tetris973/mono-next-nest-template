import React from 'react';
import { Card, Avatar, Text, Group, Stack, Loader, ActionIcon, Flex, Box } from '@mantine/core';
import { UserDto } from '@dto/modules/user/dto/user.dto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { getColorFromName } from '@web/utils/get-color-from-name.utils';

interface UserCardHeaderProps {
  loading: boolean;
  showAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}
const UserCardHeader: React.FC<UserCardHeaderProps> = ({ loading, showAdmin, onEdit, onDelete }) => {
  return (
    <Group
      justify="space-between"
      wrap="nowrap">
      <Box>
        {loading && (
          <Loader
            size="sm"
            data-testid="user-card-loading"
          />
        )}
      </Box>
      {showAdmin && (
        <Group gap="xs">
          <ActionIcon
            onClick={onEdit}
            color="blue"
            size="lg"
            aria-label="Edit user">
            <FontAwesomeIcon icon={faEdit} />
          </ActionIcon>
          <ActionIcon
            onClick={onDelete}
            color="red"
            size="lg"
            aria-label="Delete user">
            <FontAwesomeIcon icon={faTimes} />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
};

interface UserAvatarProps {
  username?: string;
}
const UserAvatar: React.FC<UserAvatarProps> = ({ username }) => {
  const backgroundColor = username ? getColorFromName(username) : undefined;

  return (
    <Flex justify="center">
      <Avatar
        src={null}
        size="xl"
        bg={backgroundColor}
        styles={{
          placeholder: {
            color: 'var(--mantine-color-gray-8)',
          },
        }}>
        {username?.charAt(0).toUpperCase()}
      </Avatar>
    </Flex>
  );
};

interface UserDetailsProps {
  user: UserDto | null;
}
const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <Stack
      align="center"
      gap="xs">
      <Text
        size="lg"
        fw={700}>
        {user?.username || ''}
      </Text>
      <Text
        size="sm"
        c="dimmed">
        ID: {user?.id || ''}
      </Text>
      <Text
        size="sm"
        c="dimmed">
        Created At: {user && new Date(user.createdAt).toLocaleString()}
      </Text>
      <Text
        size="sm"
        c="dimmed">
        Updated At: {user && new Date(user.updatedAt).toLocaleString()}
      </Text>
    </Stack>
  );
};

export interface UserCardProps {
  user: UserDto | null;
  loading: boolean;
  showAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}
export const UserCard: React.FC<UserCardProps> = ({ user, loading, showAdmin, onEdit, onDelete }) => {
  return (
    <Card
      aria-label="User card"
      miw={280}
      shadow="sm"
      radius="md"
      withBorder>
      <Stack gap="md">
        <UserCardHeader
          loading={loading}
          showAdmin={showAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <UserAvatar username={user?.username} />
        <UserDetails user={user} />
      </Stack>
    </Card>
  );
};
