'use client';

import React from 'react';
import { Box, Title, Stack, Loader, Button, Container, useMantineTheme } from '@mantine/core';
import { Header } from '@web/components/Header';
import { useProfile } from './auth/ProfileContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { profile, loading } = useProfile();
  const router = useRouter();
  const theme = useMantineTheme();

  return (
    <>
      <Header />
      <Box
        component="main"
        style={{
          minHeight: '100vh',
          backgroundColor: theme.colors.gray[0],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme.spacing.xl} ${theme.spacing.md}`,
        }}>
        <Container size="sm">
          <Stack
            gap="xl"
            align="center">
            <Title order={1}>Welcome to My Next.js App</Title>
            {loading && <Loader />}
            {!loading && profile && (
              <>
                <Title order={2}>{profile?.username}</Title>
                <Button onClick={() => router.push('/user/dashboard')}>Go to dashboard</Button>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
}
