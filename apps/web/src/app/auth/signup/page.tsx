'use client';
import React from 'react';
import { Container, Stack, Title, Box, useMantineTheme } from '@mantine/core';
import { SignupForm } from './SignupForm';
import { Header } from '@web/app/components/Header';

export default function Signup(): JSX.Element {
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
            <Title order={1}>Sign up new account</Title>
            <SignupForm />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
