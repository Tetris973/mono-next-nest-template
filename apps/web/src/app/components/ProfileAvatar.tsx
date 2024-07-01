import { Avatar, Center, Stack, FormControl, FormLabel } from '@chakra-ui/react';

export interface ProfileAvatarProps {
  username: string;
  loading: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ username, loading }) => (
  <FormControl
    id="userIcon"
    data-testid="profile-avatar-form">
    <FormLabel>User Icon</FormLabel>
    <Stack
      direction={['column', 'row']}
      spacing={6}>
      <Center>
        <Avatar
          name={loading ? '' : username}
          size="xl"
          mr={4}
          data-testid="profile-avatar"
        />
      </Center>
    </Stack>
  </FormControl>
);
