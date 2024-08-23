'use client';

import React from 'react';
import { Flex, Box, useColorModeValue, VStack, Spacer, useBoolean } from '@chakra-ui/react';
import { useDashboard as defaultUseDashboard } from './dashboard.use';
import { UserCard } from './UserCard';
import { UserList } from './UserList';
import { ProfileForm } from '@web/app/auth/profile/ProfileForm';
import { useProfile as defaultUseProfile } from '@web/app/auth/ProfileContext';
import { useCustomToast } from '@web/app/utils/toast-utils.use';
import { DeleteConfirmationDialog } from '@web/app/components/DeleteConfirmationDialog';

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
  const { toastError, toastSuccess } = useCustomToast();
  const bg = useColorModeValue('gray.50', 'gray.800');

  const [alert, setAlert] = useBoolean();
  const [editing, setEditing] = useBoolean();

  const confirmDelete = async () => {
    setAlert.off();
    if (selectedUser) {
      const error = await deleteUser(selectedUser.id);
      if (error) {
        toastError(error);
      } else {
        toastSuccess(`User ${selectedUser.username} deleted successfully!`);
      }
    }
  };

  const onSubmitSuccess = async () => {
    await loadUsers();
    if (selectedUser?.id === profile?.id) {
      loadProfile();
    }
    setEditing.off();
  };

  return (
    <>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={bg}
        p={6}>
        <Box
          display="flex"
          w="full"
          maxW="1200px">
          <Spacer />
          <UserList
            users={users}
            loading={getAllUsersPending}
            error={error}
            onUserSelect={loadUserById}
          />
          <Spacer />
          {editing && selectedUser ? (
            <ProfileForm
              userId={selectedUser.id}
              onCancel={setEditing.off}
              onSubmitSuccess={onSubmitSuccess}
            />
          ) : (
            <VStack
              spacing={8}
              align="center"
              justify="center"
              minW={'25%'}>
              <Box w={'full'}>
                <UserCard
                  user={selectedUser}
                  loading={getUserByIdPending}
                  onDelete={() => setAlert.on()}
                  showAdmin={showAdmin}
                  onEdit={setEditing.on}
                />
              </Box>
            </VStack>
          )}
          <Spacer />
        </Box>
      </Flex>

      <DeleteConfirmationDialog
        isOpen={alert}
        onClose={setAlert.off}
        onConfirm={confirmDelete}
      />
    </>
  );
}
