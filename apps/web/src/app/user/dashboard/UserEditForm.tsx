// app/dashboard/UserEditForm.tsx

import { Button, Stack, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ProfileField } from '@web/app/auth/profile/ProfileField';
import { ProfileAvatar } from '@web/app/auth/profile/ProfileAvatar';
import { User } from '@web/app/user/user.interface';

interface UserEditFormProps {
  user: User | null;
  onCancel: () => void;
  onSubmit: (user: User) => Promise<void>;
  error: string | null;
  loading: boolean;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user, onCancel, onSubmit, error, loading }) => {
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit({ ...user, username: newUsername } as User);
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
        error={error || ''}
        loading={loading}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <ProfileField
        id="createdAt"
        label="Created At"
        value={user?.createdAt || ''}
        error=""
        loading={loading}
        isReadOnly
      />
      <ProfileField
        id="updatedAt"
        label="Updated At"
        value={user?.updatedAt || ''}
        error=""
        loading={loading}
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
