'use client';

import { Box, Heading, Stack, useColorModeValue, Spinner } from '@chakra-ui/react';
import { useAuth } from './auth/authContext';
import Header from './components/Header';

export default function Home() {
  const { user, loading } = useAuth();

  const bg = useColorModeValue('gray.50', 'gray.800');

  return (
    <>
      <Header />
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={bg}
        py={12}
        px={6}>
        <Stack
          spacing={8}
          mx="auto"
          maxW="lg"
          align="center">
          <Heading fontSize="4xl">Welcome to My Next.js App</Heading>
          {!loading ? user && <Heading fontSize="4xl">{user.username}!</Heading> : <Spinner />}
        </Stack>
      </Box>
    </>
  );
}
