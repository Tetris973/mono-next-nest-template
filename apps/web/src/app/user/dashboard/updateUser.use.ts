// app/dashboard/updateUser.use.ts

import { useState } from 'react';
import { updateUserAction } from './dashboard.service';
import { User } from '@web/app/user/user.interface';
import { useToast } from '@chakra-ui/react';

export const useUserUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const updateUser = async (updatedUser: User): Promise<User | null> => {
    setLoading(true);
    try {
      const user = await updateUserAction(updatedUser);
      toast({
        title: `User ${user.username} updated successfully!`,
        status: 'success',
        isClosable: true,
      });
      setError(null);
      return user;
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: 'Error updating user.',
        description: (err as Error).message,
        status: 'error',
        isClosable: true,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading,
    error,
  };
};
