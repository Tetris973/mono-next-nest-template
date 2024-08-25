'use client';

import React from 'react';
import { Box, useMantineTheme } from '@mantine/core';
import { ProfileForm } from './ProfileForm';
import { useProfile } from '@web/app/auth/ProfileContext';
import { useRouter } from 'next/navigation';

export function ProfilePageClient() {
  const { profile: user, loadProfile } = useProfile();
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.gray[0],
      }}>
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
    </Box>
  );
}
