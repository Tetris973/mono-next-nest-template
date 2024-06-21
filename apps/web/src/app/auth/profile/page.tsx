'use client';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { ProfileForm } from './ProfileForm';
import { Header } from '@web/app/components/Header';
import { ProtectedRoute } from '@web/app/auth/ProtectedRoute';
import { useProfile } from '@web/app/auth/ProfileContext';
import { useRouter } from 'next/navigation';

export default function UserProfileEdit(): JSX.Element {
  const { profile: user, loadProfile } = useProfile();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Header />
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        {user && (
          <ProfileForm
            userId={user.id}
            onCancel={() => {
              router.push('/');
            }}
            onSubmitSuccess={() => {
              loadProfile();
            }}
          />
        )}
      </Flex>
    </ProtectedRoute>
  );
}
