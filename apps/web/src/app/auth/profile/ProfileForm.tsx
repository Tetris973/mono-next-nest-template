import React from 'react';
import { Button, Stack, Paper, Avatar, type MantineTheme } from '@mantine/core';
import { useProfileForm as defaultUseProfileForm } from './profile.use';
import { ProfileField } from '@web/components/ProfileField';
import { showSuccessNotification, showErrorNotification } from '@web/common/helpers/notifications.helpers';

export interface ProfileFormProps {
  userId: number;
  onCancel: () => void;
  onSubmitSuccess: () => void;
  useProfileForm?: typeof defaultUseProfileForm;
}

const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 40%, 70%)`;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({
  userId,
  onCancel,
  onSubmitSuccess,
  useProfileForm = defaultUseProfileForm,
}) => {
  const { user, profileError, newUsername, profilePending, submitPending, setNewUsername, handleSubmit } =
    useProfileForm(userId);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { success, error } = await handleSubmit(event);
    if (error) {
      showErrorNotification({
        message: error,
      });
    } else if (success) {
      showSuccessNotification({
        message: success,
      });
      onSubmitSuccess();
    }
  };

  const avatarColor = newUsername ? getColorFromName(newUsername) : undefined;

  return (
    <Paper
      shadow="md"
      p="lg"
      radius="md"
      withBorder
      style={{ width: '30rem' }}>
      <form
        onSubmit={handleFormSubmit}
        aria-label="Profile form">
        <Stack gap="md">
          <Avatar
            aria-label="User menu"
            src={null}
            alt={newUsername}
            size="xl"
            styles={(theme: MantineTheme) => ({
              placeholder: {
                backgroundColor: avatarColor,
                color: theme.colors.gray[8],
              },
            })}>
            {newUsername?.charAt(0).toUpperCase()}
          </Avatar>
          <ProfileField
            id="username"
            name="username"
            label="User name"
            placeholder={newUsername}
            error={Array.isArray(profileError.username) ? profileError.username.join(', ') : profileError.username}
            loading={profilePending}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <ProfileField
            id="createdAt"
            name="createdAt"
            label="Created At"
            value={user ? new Date(user.createdAt).toLocaleString() : ''}
            error={undefined}
            loading={profilePending}
            disabled
          />
          <ProfileField
            id="updatedAt"
            name="updatedAt"
            label="Updated At"
            value={user ? new Date(user.updatedAt).toLocaleString() : ''}
            error={undefined}
            loading={profilePending}
            disabled
          />
          <Stack
            gap="sm"
            style={{ flexDirection: 'row' }}>
            <Button
              aria-label="Cancel editing profile"
              onClick={onCancel}
              color="red"
              fullWidth>
              Cancel
            </Button>
            <Button
              aria-label="Submit profile changes"
              type="submit"
              color="blue"
              fullWidth
              loading={submitPending}
              loaderProps={{ type: 'dots' }}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};
