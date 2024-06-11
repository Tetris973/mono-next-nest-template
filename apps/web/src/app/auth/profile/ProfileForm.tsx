import { Button, Stack, Spinner } from '@chakra-ui/react';
import { useUserProfileEdit } from './profile.use';
import ProfileField from './ProfileField';
import ProfileAvatar from './ProfileAvatar';
import { useRouter } from 'next/navigation';

const ProfileForm: React.FC = () => {
  const { user, error, newUsername, profileLoading, loading, setNewUsername, handleSubmit } = useUserProfileEdit();
  const router = useRouter();

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
        error={error.username}
        loading={profileLoading}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <ProfileField
        id="createdAt"
        label="Created At"
        value={user?.createdAt || ''}
        error=""
        loading={profileLoading}
        isReadOnly
      />
      <ProfileField
        id="updatedAt"
        label="Updated At"
        value={user?.updatedAt || ''}
        error=""
        loading={profileLoading}
        isReadOnly
      />
      <Stack
        spacing={6}
        direction={['column', 'row']}>
        <Button
          onClick={() => router.push('/')}
          bg={'red.400'}
          color={'white'}
          w="full"
          _hover={{
            bg: 'red.500',
          }}>
          Cancel
        </Button>
        <Button
          bg={'blue.400'}
          color={'white'}
          w="full"
          _hover={{
            bg: 'blue.500',
          }}
          onClick={handleSubmit}
          isLoading={loading}
          spinner={<Spinner />}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default ProfileForm;
