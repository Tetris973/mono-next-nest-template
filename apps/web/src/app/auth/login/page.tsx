'use client';
import React from 'react';
import { Container, Stack, Title, Box, useMantineTheme } from '@mantine/core';
import { LoginForm } from './LoginForm';
import { Header } from '@web/app/components/Header';

export default function Login(): JSX.Element {
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
        }}>
        <Container size="sm">
          <Stack gap="xl">
            <Title order={1}>Log in to your account</Title>
            <LoginForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
