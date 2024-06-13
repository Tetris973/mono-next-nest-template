'use client';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { ProfileForm } from './ProfileForm';
import { Header } from '@web/app/components/Header';
import { ProtectedRoute } from '@web/app/auth/ProtectedRoute';

export default function UserProfileEdit(): JSX.Element {
  return (
    <>
      <ProtectedRoute>
        <Header />
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}>
          <ProfileForm />
        </Flex>
      </ProtectedRoute>
    </>
  );
}
