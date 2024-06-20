// apps/web/src/app/auth/profile/profile.use.ts

import { useState, useEffect } from 'react';
import { validateUserProfileEditForm } from './validation';
import { getUserByIdAction, updateUserAction } from '@web/app/user/user.service';
import { User } from '@web/app/user/user.interface';
import { HttpStatus } from '@web/app/constants/http-status.enum';

interface ProfileError {
  username: string;
}

interface ProfileFormResult {
  error?: string;
  success?: string;
}

interface UseProfileForm {
  profileError: ProfileError;
  newUsername: string;
  submitLoading: boolean;
  profileLoading: boolean;
  setNewUsername: (username: string) => void;
  handleSubmit: (event: React.FormEvent) => Promise<ProfileFormResult>;
  user: User | null;
}

export const useProfileForm = (userId: string): UseProfileForm => {
  const [user, setUser] = useState<User | null>(null);
  const [profileError, setProfileError] = useState<ProfileError>({ username: '' });
  const [newUsername, setNewUsername] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setProfileLoading(true);
      const response = await getUserByIdAction(userId);
      if ('status' in response) {
        // Nothing when error for the moment
      } else {
        setUser(response);
        setNewUsername(response.username || '');
      }
      setProfileLoading(false);
    };

    fetchUserProfile();
  }, [userId]);

  const handleSubmit = async (event: React.FormEvent): Promise<ProfileFormResult> => {
    if (!user) return { error: 'User not found' };
    event.preventDefault();
    setSubmitLoading(true);

    const validationErrors = validateUserProfileEditForm(newUsername);
    setProfileError({ username: validationErrors.username });

    if (validationErrors.username) {
      setSubmitLoading(false);
      return {};
    }

    const updatedUser = await updateUserAction(user.id, newUsername);
    setSubmitLoading(false);
    if ('status' in updatedUser) {
      if (updatedUser.status === HttpStatus.CONFLICT) {
        setProfileError({ username: updatedUser.message });
        return {};
      }
      return { error: updatedUser.message };
    }
    setUser(updatedUser);
    setNewUsername(updatedUser.username || '');
    return { success: `Profile of ${newUsername} updated successfully` };
  };

  return {
    profileError,
    newUsername,
    submitLoading,
    profileLoading,
    setNewUsername,
    handleSubmit,
    user,
  };
};
