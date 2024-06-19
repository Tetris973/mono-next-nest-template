// app/user/dashboard/Dashboard.tsx

'use client';

import React, { useRef } from 'react';
import {
  Flex,
  Box,
  useColorModeValue,
  VStack,
  Spacer,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useBoolean,
} from '@chakra-ui/react';
import { useDashboard } from './dashboard.use';
import { UserCard } from './UserCard';
import { UserList } from './UserList';
import { User } from '@web/app/user/user.interface';
import { Header } from '@web/app/components/Header';
import { ProfileForm } from '@web/app/auth/profile/ProfileForm';
import { useProfile } from '@web/app/auth/ProfileContext';

const UserCardContainer: React.FC<{
  user: User | null;
  loading: boolean;
  onDelete: () => void;
  showAdmin: boolean;
  onEdit: () => void;
}> = ({ user, loading, onDelete, showAdmin, onEdit }) => (
  <VStack
    spacing={8}
    align="center"
    justify="center"
    minW={'25%'}>
    <Box w={'full'}>
      <UserCard
        user={user}
        loading={loading}
        onDelete={onDelete}
        showAdmin={showAdmin}
        onEdit={onEdit}
      />
    </Box>
  </VStack>
);

export function Dashboard(): JSX.Element {
  const {
    users,
    selectedUser,
    loadingUsers,
    loadingSelectedUser,
    error,
    showAdmin,
    fetchUserById,
    deleteUser,
    reloadAfterUpdate,
  } = useDashboard();
  const { loadProfile, profile } = useProfile();
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'gray.800');

  const [alert, setAlert] = useBoolean();
  const [editing, setEditing] = useBoolean();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        toast({
          title: `User ${selectedUser.username} deleted successfully!`,
          status: 'success',
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Error deleting user.',
          status: 'error',
          isClosable: true,
        });
      } finally {
        setAlert.off();
      }
    }
  };

  const onSubmitSuccess = () => {
    reloadAfterUpdate();
    if (selectedUser?.id === profile?.id) {
      loadProfile();
    }
    setEditing.off();
  };

  return (
    <>
      <Header />
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
            loading={loadingUsers}
            error={error}
            onUserSelect={fetchUserById}
            containerStyle={{ marginRight: '32px' }}
          />
          <Spacer />
          {editing && selectedUser ? (
            <ProfileForm
              userId={selectedUser.id || ''}
              onCancel={setEditing.off}
              onSubmitSuccess={onSubmitSuccess}
            />
          ) : (
            <UserCardContainer
              user={selectedUser}
              loading={loadingSelectedUser}
              onDelete={() => setAlert.on()}
              showAdmin={showAdmin}
              onEdit={setEditing.on}
            />
          )}
          <Spacer />
        </Box>
      </Flex>

      <AlertDialog
        isOpen={alert}
        leastDestructiveRef={cancelRef}
        onClose={() => setAlert.on}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold">
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={setAlert.off}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
