import { useState, useEffect } from 'react';
import { validateUserProfileEditForm } from './validation';
import { getUserByIdAction, updateUserAction } from '@web/app/user/user.service';
import { UserDto } from '@dto/user/dto/user.dto';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';
import { FormSubmitResult } from '@web/app/common/form-submit-result.interface';

interface UseProfileForm {
  profileError: UpdateUserDto;
  newUsername: string;
  submitLoading: boolean;
  profileLoading: boolean;
  setNewUsername: (username: string) => void;
  handleSubmit: (event: React.FormEvent) => Promise<FormSubmitResult>;
  user: UserDto | null;
}

export const useProfileForm = (userId: number): UseProfileForm => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [profileError, setProfileError] = useState<UpdateUserDto>({ username: '' });
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

  const handleSubmit = async (event: React.FormEvent): Promise<FormSubmitResult> => {
    if (!user) return { error: 'User not found' };
    event.preventDefault();
    setSubmitLoading(true);

    const validationErrors = validateUserProfileEditForm({ username: newUsername });
    setProfileError(validationErrors);

    if (validationErrors.username) {
      setSubmitLoading(false);
      return {};
    }

    const updatedUser = await updateUserAction(user.id, { username: newUsername });
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
