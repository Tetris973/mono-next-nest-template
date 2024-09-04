'use client';

import React from 'react';
import { AppShell, Flex, Box, Stack, useMantineTheme, Paper, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { showSuccessNotification, showErrorNotification } from '@web/common/helpers/notifications.helpers';

import { useDashboard as defaultUseDashboard } from './dashboard.hook';
import { UserCard } from './UserCard';
import { FilteredUserList } from './FilteredUserList';
import { ProfileForm } from '@web/app/auth/profile/ProfileForm';
import { useProfile as defaultUseProfile } from '@web/app/auth/ProfileContext';

export interface DashboardProps {
  useDashboard?: typeof defaultUseDashboard;
  useProfile?: typeof defaultUseProfile;
}

export function Dashboard({
  useDashboard = defaultUseDashboard,
  useProfile = defaultUseProfile,
}: DashboardProps): JSX.Element {
  const {
    users,
    selectedUser,
    getAllUsersPending,
    getUserByIdPending,
    error,
    showAdmin,
    loadUserById,
    deleteUser,
    loadUsers,
  } = useDashboard();

  const { loadProfile, profile } = useProfile();
  const theme = useMantineTheme();

  const [editing, { toggle: toggleEditing, close: closeEditing }] = useDisclosure(false);

  const confirmDelete = async () => {
    if (selectedUser) {
      const error = await deleteUser(selectedUser.id);
      if (error) {
        showErrorNotification({
          message: `Error deleting user ${selectedUser.username}: ${error}`,
        });
      } else {
        showSuccessNotification({
          message: `User ${selectedUser.username} deleted successfully!`,
        });
      }
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete User',
      centered: true,
      children: <Text>Are you sure you want to delete this user? This action cannot be undone.</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: confirmDelete,
    });

  const onSubmitSuccess = async () => {
    await loadUsers();
    if (selectedUser?.id === profile?.id) {
      loadProfile();
    }
    closeEditing();
  };

  return (
    <AppShell padding="md">
      <Flex
        mih="100vh"
        align="center"
        justify="center"
        bg={theme.colors.gray[0]}
        p={theme.spacing.md}>
        <Box style={{ display: 'flex', width: '100%', maxWidth: 1200 }}>
          <Box style={{ flex: 1 }} />
          <Paper
            p="md"
            bg="transparent"
            style={{ flex: 2 }}>
            <FilteredUserList
              users={users}
              isLoading={getAllUsersPending}
              error={error}
              onUserSelect={loadUserById}
              selectedUserId={selectedUser?.id}
            />
          </Paper>
          <Box style={{ flex: 1 }} />
          <Paper
            p="md"
            bg="transparent"
            style={{ flex: 2 }}>
            {editing && selectedUser ? (
              <ProfileForm
                userId={selectedUser.id}
                onCancel={closeEditing}
                onSubmitSuccess={onSubmitSuccess}
              />
            ) : (
              <Stack
                align="center"
                justify="center"
                miw="25%">
                <Box w="100%">
                  <UserCard
                    user={selectedUser}
                    loading={getUserByIdPending}
                    onDelete={openDeleteModal}
                    showAdmin={showAdmin}
                    onEdit={toggleEditing}
                  />
                </Box>
              </Stack>
            )}
          </Paper>
          <Box style={{ flex: 1 }} />
        </Box>
      </Flex>
    </AppShell>
  );
}
