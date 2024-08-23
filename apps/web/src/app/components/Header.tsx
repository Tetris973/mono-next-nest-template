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
import { useProfile as defaultUseProfile } from '@web/app/auth/ProfileContext';
import { useAuth as defaultUseAuth } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';

export interface HeaderProps {
  useAuth?: typeof defaultUseAuth;
  useProfile?: typeof defaultUseProfile;
}

export const Header: React.FC<HeaderProps> = ({ useAuth = defaultUseAuth, useProfile = defaultUseProfile }) => {
  const { logout, isAuthenticated } = useAuth();
  const { profile, loading } = useProfile();
  const router = useRouter();

  const handleHomeClick = () => router.push('/');
  const handleProfileClick = () => router.push('/auth/profile');
  const handleSignupClick = () => router.push('/auth/signup');

  const renderAuthenticatedMenu = () => (
    <Flex align="center">
      <Menu>
        <MenuButton
          aria-label="User menu"
          as={Button}
          bg="transparent"
          p={0}
          cursor="pointer">
          <Avatar
            name={profile?.username}
            size="sm"
          />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleProfileClick}>
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
  );

  const renderUnauthenticatedMenu = () => (
    <Button
      onClick={handleSignupClick}
      leftIcon={<FontAwesomeIcon icon={faSignInAlt} />}
      colorScheme="teal">
      Signup
    </Button>
  );

  const renderMenuContent = () => {
    if (loading || isAuthenticated === undefined) {
      return <Spinner data-testid="header-loading-spinner" />;
    }
    if (profile) {
      return renderAuthenticatedMenu();
    }
    return renderUnauthenticatedMenu();
  };

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
          <Button
            onClick={handleHomeClick}
            leftIcon={
              <FontAwesomeIcon
                icon={faHome}
                size="2x"
                color="gray.600"
              />
            }
            fontWeight="bold"
            fontSize="xl"
            variant="ghost">
            My App
          </Button>
        </Flex>
        {renderMenuContent()}
      </Flex>
    </Box>
  );
};
