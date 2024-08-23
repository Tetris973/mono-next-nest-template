'use client';

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from '@web/lib/mantine-theme';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './auth/AuthContext';
import { ProfileProvider } from './auth/ProfileContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <ChakraProvider>
        <AuthProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </AuthProvider>
      </ChakraProvider>
    </MantineProvider>
  );
}
