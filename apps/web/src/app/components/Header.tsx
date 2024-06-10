'use client';

import React from 'react';
import { Box, Flex, Button, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { useAuth } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';

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

export default Header;