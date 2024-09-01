import React from 'react';
import { Button, Stack, Paper, Avatar } from '@mantine/core';
import { useProfileForm as defaultUseProfileForm } from './profile.use';
import { ProfileField } from '@web/components/ProfileField';
import { showSuccessNotification, showErrorNotification } from '@web/common/helpers/notifications.helpers';
import { UserDto } from '@dto/modules/user/dto/user.dto';
import { UpdateUserDto } from '@dto/modules/user/dto/update-user.dto';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';
import { getColorFromName } from '@web/utils/get-color-from-name.utils';

interface UserAvatarProps {
  username: string;
}
const UserAvatar: React.FC<UserAvatarProps> = ({ username }) => {
  const avatarColor = getColorFromName(username);

  return (
    <Avatar
      src={null}
      size="xl"
      bg={avatarColor}
      styles={{
        placeholder: {
          color: 'var(--mantine-color-gray-8)',
        },
      }}>
      {username?.charAt(0).toUpperCase()}
    </Avatar>
  );
};

interface UserInfoFieldsProps {
  user: UserDto | null;
  profileError: DtoValidationError<UpdateUserDto>;
  profilePending: boolean;
}
const UserInfoFields: React.FC<UserInfoFieldsProps> = ({ user, profileError, profilePending }) => {
  return (
    <Stack gap="md">
      <ProfileField
        id="username"
        name="username"
        label="User name"
        defaultValue={user?.username || ''}
        error={Array.isArray(profileError.username) ? profileError.username.join(', ') : profileError.username}
        loading={profilePending}
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
    </Stack>
  );
};

interface ActionButtonsProps {
  onCancel: () => void;
  submitPending: boolean;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, submitPending }) => {
  return (
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
  );
};

export interface ProfileFormProps {
  userId: number;
  onCancel: () => void;
  onSubmitSuccess: () => void;
  useProfileForm?: typeof defaultUseProfileForm;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  userId,
  onCancel,
  onSubmitSuccess,
  useProfileForm = defaultUseProfileForm,
}) => {
  const { user, profileError, profilePending, submitPending, handleSubmit } = useProfileForm(userId);

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

  return (
    <Paper
      shadow="md"
      p="lg"
      radius="md"
      withBorder
      w="30rem">
      <form
        onSubmit={handleFormSubmit}
        aria-label="Profile form">
        <Stack gap="md">
          <UserAvatar username={user?.username || ''} />
          <UserInfoFields
            user={user}
            profileError={profileError}
            profilePending={profilePending}
          />
          <ActionButtons
            onCancel={onCancel}
            submitPending={submitPending}
          />
        </Stack>
      </form>
    </Paper>
  );
};
