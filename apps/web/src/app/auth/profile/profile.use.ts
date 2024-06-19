// apps/web/src/app/auth/profile/profile.use.ts

import { useState, useEffect } from 'react';
import { validateUserProfileEditForm } from './validation';
import { HttpStatus } from '@web/app/constants/http-status';
import { getUserByIdAction, updateUserAction } from '@web/app/user/user.service';
import { User } from '@web/app/user/user.interface';

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
      const getUserResponse = await getUserByIdAction(userId);
      if ('status' in getUserResponse) {
        setProfileLoading(false);
        return;
      }
      setUser(getUserResponse);
      setNewUsername(getUserResponse.username || '');
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

    const updateResponse = await updateUserAction(user.id, newUsername);
    setSubmitLoading(false);

    if ('status' in updateResponse) {
      if (updateResponse.status === HttpStatus.CONFLICT) {
        setProfileError({ username: updateResponse.message });
        return {};
      }
      return { error: updateResponse.message };
    }

    setUser(updateResponse);
    setNewUsername(updateResponse.username || '');
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
