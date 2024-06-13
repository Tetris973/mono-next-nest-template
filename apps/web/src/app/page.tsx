'use client';

import { Box, Heading, Stack, useColorModeValue, Spinner, Button } from '@chakra-ui/react';
import { Header } from './components/Header';
import { useProfile } from './auth/ProfileContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useProfile();
  const router = useRouter();

  return (
    <>
      <Header />
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue('gray.50', 'gray.800')}
        py={12}
        px={6}>
        <Stack
          spacing={8}
          mx="auto"
          maxW="lg"
          align="center">
          <Heading fontSize="4xl">Welcome to My Next.js App</Heading>
          {loading && <Spinner />}
          {!loading && user && (
            <>
              <Heading fontSize="4xl">{user?.username}</Heading>
              <Button onClick={() => router.push('/user/dashboard')}>Go to dashboard</Button>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
}
