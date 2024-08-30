import { Card, Avatar, Text, Group, Stack, Loader, ActionIcon } from '@mantine/core';
import { UserDto } from '@dto/modules/user/dto/user.dto';
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
  <Loader
    size="sm"
    style={{
      position: 'absolute',
      top: '0.5rem',
      left: '0.5rem',
    }}
    data-testid="user-card-loading"
  />
);

const renderAdminButtons = (onDelete: () => void, onEdit: () => void, visible: boolean) => (
  <Group
    justify="center"
    gap="xs"
    style={{
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
    }}>
    <ActionIcon
      aria-label="Edit user"
      color="blue"
      size="lg"
      onClick={onEdit}>
      <FontAwesomeIcon icon={faEdit} />
    </ActionIcon>
    <ActionIcon
      aria-label="Delete user"
      color="red"
      size="lg"
      onClick={onDelete}>
      <FontAwesomeIcon icon={faTimes} />
    </ActionIcon>
  </Group>
);

const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 40%, 70%)`;
};

const renderUserInfo = (user: UserDto | null) => {
  const backgroundColor = user?.username ? getColorFromName(user.username) : undefined;

  return (
    <Stack
      align="center"
      gap="sm">
      <Avatar
        src={null}
        size="xl"
        styles={(theme) => ({
          placeholder: {
            backgroundColor,
            color: theme.colors.gray[8],
          },
        })}>
        {user?.username?.charAt(0).toUpperCase()}
      </Avatar>
      <Text
        size="lg"
        fw={700}>
        {user?.username}
      </Text>
      <Text
        size="sm"
        c="dimmed">
        ID: {user?.id}
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

export const UserCard: React.FC<UserCardProps> = ({ user, loading, onDelete, showAdmin, onEdit }) => {
  return (
    <Card
      aria-label="User card"
      shadow="sm"
      pl="xl"
      pr="xl"
      radius="md"
      withBorder
      style={{ position: 'relative' }}>
      {loading && renderLoading()}
      {renderAdminButtons(onDelete, onEdit, !!user && showAdmin)}
      <Card.Section py="md">{renderUserInfo(user)}</Card.Section>
    </Card>
  );
};
