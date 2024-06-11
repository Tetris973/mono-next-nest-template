// app/auth/profile/page.tsx

'use client';

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Skeleton,
  Spinner,
} from '@chakra-ui/react';
import { useUserProfileEdit } from './profile.use';
import Header from '@web/app/components/Header';
import { useRouter } from 'next/navigation';

export default function UserProfileEdit(): JSX.Element {
  const { user, error, newUsername, profileLoading, loading, setNewUsername, handleSubmit } = useUserProfileEdit();
  const router = useRouter();

  return (
    <>
      <Header />
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userIcon">
            <FormLabel>User Icon</FormLabel>
            <Stack
              direction={['column', 'row']}
              spacing={6}>
              <Center>
                <Avatar
                  name={newUsername}
                  size="xl"
                  mr={4}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl
            id="userName"
            isInvalid={!!error.username}
            isRequired>
            <FormLabel>User name</FormLabel>
            {profileLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Input
                placeholder="UserName"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            )}
            <FormErrorMessage>{error.username}</FormErrorMessage>
          </FormControl>
          <FormControl id="createdAt">
            <FormLabel>Created At</FormLabel>
            {profileLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Input
                placeholder="Created At"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={user?.createdAt || ''}
                isReadOnly
                _readOnly={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            )}
          </FormControl>
          <FormControl id="updatedAt">
            <FormLabel>Updated At</FormLabel>
            {profileLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Input
                placeholder="Updated At"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={user?.updatedAt || ''}
                isReadOnly
                _readOnly={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            )}
          </FormControl>
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
      </Flex>
    </>
  );
}
