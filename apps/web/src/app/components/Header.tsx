'use client';

import React from 'react';
import { Box, Flex, Button, Text, Avatar } from '@chakra-ui/react';
import { useAuth } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  return (
    <Box
      bg="gray.100"
      py={4}>
      <Flex
        maxW="container.lg"
        mx="auto"
        align="center"
        justify="space-between">
        <Flex alignItems="center">
          <Box mr={4}>
            <FontAwesomeIcon
              icon={faHome}
              size="2x"
              color="gray.600"
            />
          </Box>
          <Text
            fontWeight="bold"
            fontSize="xl">
            My App
          </Text>
        </Flex>
        {!loading && user && (
          <Flex align="center">
            <Avatar
              name={user.username}
              size="sm"
              mr={4}
            />
            <Button
              onClick={logout}
              leftIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
              colorScheme="gray">
              Logout
            </Button>
          </Flex>
        )}
        {!loading && !user && (
          <Button
            onClick={() => router.push('/auth/login')}
            leftIcon={<FontAwesomeIcon icon={faSignInAlt} />}
            colorScheme="teal">
            Login
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
