'use client';

import React from 'react';
import { AppShell, Group, Button, Avatar, Menu, Text, Loader, rem } from '@mantine/core';
import { useProfile as defaultUseProfile } from '@web/app/auth/ProfileContext';
import { useAuth as defaultUseAuth } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';

export interface HeaderProps {
  useAuth?: typeof defaultUseAuth;
  useProfile?: typeof defaultUseProfile;
}

const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 40%, 70%)`;
};

export function Header({ useAuth = defaultUseAuth, useProfile = defaultUseProfile }: HeaderProps) {
  const { logout, isAuthenticated } = useAuth();
  const { profile, loading } = useProfile();
  const router = useRouter();

  const handleHomeClick = () => router.push('/');
  const handleProfileClick = () => router.push('/auth/profile');
  const handleSignupClick = () => router.push('/auth/signup');

  const backgroundColor = profile?.username ? getColorFromName(profile.username) : undefined;

  const AuthenticatedMenu = () => (
    <Menu
      shadow="md"
      width={200}>
      <Menu.Target>
        <Avatar
          component="button"
          aria-label="User menu"
          alt={profile?.username}
          radius="xl"
          size="md"
          styles={(theme) => ({
            root: {
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              padding: 0,
            },
            placeholder: {
              backgroundColor,
              color: theme.colors.gray[8],
            },
          })}>
          {profile?.username?.charAt(0).toUpperCase()}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <FontAwesomeIcon
              icon={faUser}
              style={{ width: rem(14), height: rem(14) }}
            />
          }
          onClick={handleProfileClick}>
          Profile
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={
            <FontAwesomeIcon
              icon={faSignOutAlt}
              style={{ width: rem(14), height: rem(14) }}
            />
          }
          onClick={logout}
          color="red">
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  const UnauthenticatedMenu = () => (
    <Button
      onClick={handleSignupClick}
      leftSection={
        <FontAwesomeIcon
          icon={faSignInAlt}
          size="sm"
        />
      }
      variant="filled">
      Signup
    </Button>
  );

  const MenuContent = () => {
    if (loading || isAuthenticated === undefined) {
      return (
        <Loader
          size="sm"
          data-testid="header-loading-spinner"
        />
      );
    }
    return profile ? <AuthenticatedMenu /> : <UnauthenticatedMenu />;
  };

  return (
    <AppShell.Header>
      <Group
        bg="gray.1"
        justify="space-between"
        h="100%"
        px="md">
        <Group>
          <Button
            variant="subtle"
            color="gray.9"
            leftSection={
              <FontAwesomeIcon
                icon={faHome}
                size="2x"
                style={{ color: 'var(--mantine-color-gray-9)' }}
              />
            }
            onClick={handleHomeClick}>
            <Text
              size="xl"
              fw={700}
              c="gray.9">
              My App
            </Text>
          </Button>
        </Group>
        <MenuContent />
      </Group>
    </AppShell.Header>
  );
}
