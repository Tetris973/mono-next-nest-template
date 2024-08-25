import { Button, Stack, Spinner, useColorModeValue, chakra, Box } from '@chakra-ui/react';
import { useProfileForm as defaultUseProfileForm } from './profile.use';
import { ProfileField } from '@web/app/components/ProfileField';
import { ProfileAvatar } from '@web/app/components/ProfileAvatar';
import { showSuccessNotification, showErrorNotification } from '@web/app/utils/notifications';

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

  return (
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}
      w={'md'}>
      <chakra.form
        onSubmit={handleFormSubmit}
        aria-label="Profile form">
        <Stack spacing={4}>
          <ProfileAvatar
            username={newUsername}
            loading={profilePending}
          />
          <ProfileField
            id="username"
            name="username"
            label="User name"
            value={newUsername}
            error={profileError.username}
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
            isReadOnly
          />
          <ProfileField
            id="updatedAt"
            name="updatedAt"
            label="Updated At"
            value={user ? new Date(user.updatedAt).toLocaleString() : ''}
            error={undefined}
            loading={profilePending}
            isReadOnly
          />
          <Stack
            spacing={6}
            direction={['column', 'row']}>
            <Button
              aria-label="Cancel editing profile"
              onClick={onCancel}
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{ bg: 'red.500' }}>
              Cancel
            </Button>
            <Button
              aria-label="Submit profile changes"
              type="submit"
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{ bg: 'blue.500' }}
              isLoading={submitPending}
              spinner={<Spinner />}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </chakra.form>
    </Box>
  );
};
