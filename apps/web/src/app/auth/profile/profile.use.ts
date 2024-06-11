// app/auth/profile/hooks/useUserProfileEdit.ts

import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { validateUserProfileEditForm } from './validation';
import { HttpStatus } from '@web/app/constants/http-status';
import { useProfile } from '@web/app/auth/ProfileContext';
import { useRouter } from 'next/navigation';

export const useUserProfileEdit = () => {
  const { user, updateProfile, loading: profileLoading } = useProfile();
  const [error, setError] = useState({ username: '' });
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user && !profileLoading) {
      router.push('/auth/login');
    } else {
      setNewUsername(user?.username || '');
    }
  }, [user, profileLoading, router]);

  const toastServerError = (message: string) => {
    toast.closeAll();
    toast({
      title: 'Server Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUpdateProfileError = (updateError: any) => {
    if (updateError.status === HttpStatus.CONFLICT) {
      setError((prev) => ({ ...prev, username: updateError.message }));
    } else {
      toast.closeAll();
      toastServerError(updateError.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const validationErrors = validateUserProfileEditForm(newUsername);
    setError(validationErrors);

    if (validationErrors.username) {
      setLoading(false);
      return;
    }

    const updateError = await updateProfile(newUsername);

    setLoading(false);

    if (updateError) {
      handleUpdateProfileError(updateError);
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return {
    error,
    newUsername,
    loading,
    profileLoading,
    setNewUsername,
    handleSubmit,
    user,
  };
};
