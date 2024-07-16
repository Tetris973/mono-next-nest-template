'use client';

import React from 'react';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { ProfileForm } from './ProfileForm';
import { useProfile } from '@web/app/auth/ProfileContext';
import { useRouter } from 'next/navigation';

export function ProfilePageClient() {
  const { profile: user, loadProfile } = useProfile();
  const router = useRouter();

  return (
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
  );
}
