'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProviderNew } from './auth/AuthContext';
import { ProfileProvider } from './auth/ProfileContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AuthProviderNew>
        <ProfileProvider>{children}</ProfileProvider>
      </AuthProviderNew>
    </ChakraProvider>
  );
}
