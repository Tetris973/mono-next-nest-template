'use client';
import { useEffect } from 'react';
import { Box, Button, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from './auth/authContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/user', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    }

    fetchUser();
  }, [setUser]);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'GET',
    });
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return <></>;
  }

  return (
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
        {user ? (
          <>
            <Heading fontSize="4xl">Welcome, {user.username}!</Heading>
            <Text
              fontSize="lg"
              color={textColor}>
              You are logged in.
            </Text>
            <Button
              onClick={handleLogout}
              bg="blue.400"
              color="white"
              _hover={{ bg: 'blue.500' }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Heading fontSize="4xl">Welcome to My Next.js App</Heading>
            <Text
              fontSize="lg"
              color={textColor}>
              Get started by exploring the{' '}
              <Button
                as={NextLink}
                href="/auth/login"
                color="blue.400"
                variant="link">
                Login Page
              </Button>
            </Text>
            <Button
              as={NextLink}
              href="/auth/login"
              bg="blue.400"
              color="white"
              _hover={{ bg: 'blue.500' }}>
              Go to Login
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
