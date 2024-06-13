'use client';

import React from 'react';
import {
  Box,
  Flex,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Spinner,
} from '@chakra-ui/react';
import { useProfile } from '@web/app/auth/ProfileContext';
import { useAuth } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const { user, loading } = useProfile();
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
            <Button
              onClick={() => router.push('/')}
              leftIcon={
                <FontAwesomeIcon
                  icon={faHome}
                  size="2x"
                  color="gray.600"
                />
              }
              fontWeight="bold"
              fontSize="xl">
              My App
            </Button>
          </Box>
        </Flex>
        {loading && <Spinner />}
        {!loading && user && (
          <Flex align="center">
            <Menu>
              <MenuButton>
                <Avatar
                  name={user.username}
                  size="sm"
                  mr={4}
                  cursor="pointer"
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push('/auth/profile')}>
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ marginRight: '10px' }}
                  />
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={logout}>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: '10px' }}
                  />
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
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
