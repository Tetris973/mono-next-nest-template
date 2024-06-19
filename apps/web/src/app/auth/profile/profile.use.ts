// apps/web/src/app/auth/profile/profile.use.ts

import { useState, useEffect } from 'react';
import { validateUserProfileEditForm } from './validation';
import { getUserByIdAction, updateUserAction } from '@web/app/user/user.service';
import { User } from '@web/app/user/user.interface';
import { ApiException, ConflictException } from '@web/app/common/ApiException';

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
      try {
        const user = await getUserByIdAction(userId);
        setUser(user);
        setNewUsername(user.username || '');
      } catch (err) {
        if (err instanceof ApiException) {
          setProfileError({ username: err.message });
        }
      } finally {
        setProfileLoading(false);
      }
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

    try {
      const updatedUser = await updateUserAction(user.id, newUsername);
      setUser(updatedUser);
      setNewUsername(updatedUser.username || '');
      return { success: `Profile of ${newUsername} updated successfully` };
    } catch (err) {
      if (err instanceof ConflictException) {
        setProfileError({ username: err.message });
        return {};
      }
      return { error: (err as ApiException).message };
    } finally {
      setSubmitLoading(false);
    }
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
