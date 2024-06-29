import { Button, Stack, Spinner } from '@chakra-ui/react';
import { useProfileForm as defaultUseProfileForm } from './profile.use';
import { ProfileField } from '../../components/ProfileField';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { useCustomToast } from '@web/app/utils/toast-utils.use';

interface ProfileFormProps {
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
  const { toastError, toastSuccess } = useCustomToast();

  const handleFormSubmit = async (event: React.FormEvent) => {
    const { success, error } = await handleSubmit(event);
    if (error) {
      toastError(error);
    } else if (success) {
      toastSuccess(success);
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
      <ProfileAvatar
        username={newUsername}
        loading={profilePending}
      />
      <ProfileField
        id="userName"
        label="User name"
        value={newUsername}
        error={profileError.username}
        loading={profilePending}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <ProfileField
        id="createdAt"
        label="Created At"
        value={user ? new Date(user.createdAt).toLocaleString() : ''}
        error={undefined}
        loading={profilePending}
        isReadOnly
      />
      <ProfileField
        id="updatedAt"
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
          bg={'blue.400'}
          color={'white'}
          w="full"
          _hover={{ bg: 'blue.500' }}
          onClick={handleFormSubmit}
          isLoading={submitPending}
          spinner={<Spinner />}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
