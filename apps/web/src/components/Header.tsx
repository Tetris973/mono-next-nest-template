'use client';

import React from 'react';
import { AppShell, Group, Button, Avatar, Menu, Text, Loader, rem } from '@mantine/core';
import { useProfile as defaultUseProfile } from '@web/app/auth/ProfileContext';
import { useAuth as defaultUseAuth } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { getColorFromName } from '@web/utils/get-color-from-name.utils';
import { UserDto } from '@dto/modules/user/dto/user.dto';

const HomeButton = () => {
  const router = useRouter();
  const onClick = () => router.push('/');

  return (
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
      onClick={onClick}>
      <Text
        size="xl"
        fw={700}
        c="gray.9">
        My App
      </Text>
    </Button>
  );
};

interface AuthenticatedMenuProps {
  profile: UserDto;
  onLogout: () => void;
}
const AuthenticatedMenu: React.FC<AuthenticatedMenuProps> = ({ profile, onLogout }) => {
  const backgroundColor = profile?.username ? getColorFromName(profile.username) : undefined;
  const router = useRouter();

  const onProfileClick = () => router.push('/auth/profile');

  return (
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
          onClick={onProfileClick}>
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
          onClick={onLogout}
          color="red">
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const UnauthenticatedMenu = () => {
  const router = useRouter();
  const onSignupClick = () => router.push('/auth/signup');

  return (
    <Button
      onClick={onSignupClick}
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
};

interface MenuContentProps {
  loading: boolean;
  isAuthenticated: boolean | undefined;
  profile: UserDto | null;
  onLogout: () => void;
}
const MenuContent: React.FC<MenuContentProps> = ({ loading, isAuthenticated, profile, onLogout }) => {
  if (loading || isAuthenticated === undefined) {
    return (
      <Loader
        size="sm"
        data-testid="header-loading-spinner"
      />
    );
  }
  return profile ? (
    <AuthenticatedMenu
      profile={profile}
      onLogout={onLogout}
    />
  ) : (
    <UnauthenticatedMenu />
  );
};

export interface HeaderProps {
  useAuth?: typeof defaultUseAuth;
  useProfile?: typeof defaultUseProfile;
}

export function Header({ useAuth = defaultUseAuth, useProfile = defaultUseProfile }: HeaderProps) {
  const { logout, isAuthenticated } = useAuth();
  const { profile, loading } = useProfile();

  return (
    <AppShell.Header>
      <Group
        bg="gray.1"
        justify="space-between"
        h="100%"
        px="md">
        <HomeButton />
        <MenuContent
          loading={loading}
          isAuthenticated={isAuthenticated}
          profile={profile}
          onLogout={logout}
        />
      </Group>
    </AppShell.Header>
  );
}
