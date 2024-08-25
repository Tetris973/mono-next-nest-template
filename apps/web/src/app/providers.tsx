'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { theme } from '@web/lib/mantine-theme';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './auth/AuthContext';
import { ProfileProvider } from './auth/ProfileContext';
import { Notifications } from '@mantine/notifications';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // If you add a component or provider from Mantine here, remember to add it to to the test utils test/utils/unit-test/renderer.tsx
    <MantineProvider theme={theme}>
      <Notifications />
      <ModalsProvider>
        <ChakraProvider>
          <AuthProvider>
            <ProfileProvider>{children}</ProfileProvider>
          </AuthProvider>
        </ChakraProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
