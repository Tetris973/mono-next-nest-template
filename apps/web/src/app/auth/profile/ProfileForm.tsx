import { Button, Stack, Spinner } from '@chakra-ui/react';
import { useProfileForm } from './profile.use';
import { ProfileField } from './ProfileField';
import { ProfileAvatar } from './ProfileAvatar';
import { useCustomToast } from '@web/app/utils/toastUtils';

interface ProfileFormProps {
  userId: number;
  onCancel: () => void;
  onSubmitSuccess: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ userId, onCancel, onSubmitSuccess }) => {
  const { user, profileError, newUsername, profileLoading, submitLoading, setNewUsername, handleSubmit } =
    useProfileForm(userId);
  const { toastError, toastSuccess } = useCustomToast();

  const handleFormSubmit = async (event: React.FormEvent) => {
    const result = await handleSubmit(event);
    if (result.error) {
      toastError(result.error);
    } else if (result.success) {
      toastSuccess(result.success);
      onSubmitSuccess();
    }
  };

  return (
    <Stack
      spacing={4}
      w={'full'}
      maxW={'md'}
      bg={'white'}
      rounded={'xl'}
      boxShadow={'lg'}
      p={6}
      my={12}>
      <ProfileAvatar username={newUsername} />
      <ProfileField
        id="userName"
        label="User name"
        value={newUsername}
        error={profileError.username}
        loading={profileLoading}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <ProfileField
        id="createdAt"
        label="Created At"
        value={user ? new Date(user.createdAt).toLocaleString() : ''}
        error=""
        loading={profileLoading}
        isReadOnly
      />
      <ProfileField
        id="updatedAt"
        label="Updated At"
        value={user ? new Date(user.updatedAt).toLocaleString() : ''}
        error=""
        loading={profileLoading}
        isReadOnly
      />
      <Stack
        spacing={6}
        direction={['column', 'row']}>
        <Button
          onClick={onCancel}
          bg={'red.400'}
          color={'white'}
          w="full"
          _hover={{ bg: 'red.500' }}>
          Cancel
        </Button>
        <Button
          bg={'blue.400'}
          color={'white'}
          w="full"
          _hover={{ bg: 'blue.500' }}
          onClick={handleFormSubmit}
          isLoading={submitLoading}
          spinner={<Spinner />}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
