'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './auth/AuthContext';
import { ProfileProvider } from './auth/ProfileContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
