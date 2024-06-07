'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
  Skeleton,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';
import Header from '@web/app/components/Header';

export default function UserProfileEdit(): JSX.Element {
  const { user, loading, updateProfile } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login');
    } else {
      setNewUsername(user?.username || '');
    }
  }, [user, loading, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateProfile(newUsername);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
            isRequired>
            <FormLabel>User name</FormLabel>
            {loading ? (
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
          </FormControl>
          <FormControl id="createdAt">
            <FormLabel>Created At</FormLabel>
            {loading ? (
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
            {loading ? (
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
              onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
