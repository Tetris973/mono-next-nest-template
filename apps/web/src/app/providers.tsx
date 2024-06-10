'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './auth/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
}
