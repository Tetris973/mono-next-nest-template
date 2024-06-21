import { Avatar, Center, Stack, FormControl, FormLabel } from '@chakra-ui/react';

interface ProfileAvatarProps {
  username: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ username }) => (
  <FormControl id="userIcon">
    <FormLabel>User Icon</FormLabel>
    <Stack
      direction={['column', 'row']}
      spacing={6}>
      <Center>
        <Avatar
          name={username}
          size="xl"
          mr={4}
        />
      </Center>
    </Stack>
  </FormControl>
);
