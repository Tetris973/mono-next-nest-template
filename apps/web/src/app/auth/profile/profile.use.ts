import { useState, useEffect } from 'react';
import { validateUserProfileEditForm } from './validation';
import {
  getUserByIdAction as defaultGetUserByIdAction,
  updateUserAction as defaultUpdateUserAction,
} from '@web/app/user/user.service';
import { UserDto } from '@dto/user/dto/user.dto';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';
import { FormSubmitResult } from '@web/app/common/form-submit-result.interface';
import { useServerAction } from '../../utils/server-action.use';
import { ActionResponse } from '@web/app/common/action-response.type';

interface UseProfileForm {
  profileError: UpdateUserDto;
  newUsername: string;
  submitPending: boolean;
  profilePending: boolean;
  setNewUsername: (username: string) => void;
  handleSubmit: (event: React.FormEvent) => Promise<FormSubmitResult>;
  user: UserDto | null;
}

export interface UseProfileFormDependencies {
  getUserByIdAction?: (userId: number) => Promise<ActionResponse<UserDto>>;
  updateUserAction?: (userId: number, data: UpdateUserDto) => Promise<ActionResponse<UserDto>>;
}

export const useProfileForm = (
  userId: number,
  {
    getUserByIdAction = defaultGetUserByIdAction,
    updateUserAction = defaultUpdateUserAction,
  }: UseProfileFormDependencies = {},
): UseProfileForm => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [profileError, setProfileError] = useState<UpdateUserDto>({ username: '' });
  const [newUsername, setNewUsername] = useState('');
  const [submitPending, updateUser] = useServerAction(updateUserAction);
  const [profilePending, getProfile] = useServerAction(getUserByIdAction);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { result, error } = await getProfile(userId);
      if (error) {
        // Nothing when error for the moment
      } else {
        setUser(result);
        setNewUsername(result.username);
      }
    };

    fetchUserProfile();
  }, [userId, getProfile]);

  const handleSubmit = async (event: React.FormEvent): Promise<FormSubmitResult> => {
    if (!user) return { error: 'No user selected, cannot update profile' };
    event.preventDefault();

    const validationErrors = validateUserProfileEditForm({ username: newUsername });
    setProfileError(validationErrors);
    if (validationErrors.username) return {};

    const { result, error } = await updateUser(user.id, { username: newUsername });
    if (error) {
      if (error.status === HttpStatus.CONFLICT) {
        setProfileError({ username: error.message });
        return {};
      }
      return { error: error.message };
    }
    setUser(result);
    setNewUsername(result.username);
    return { success: `Profile of ${newUsername} updated successfully` };
  };

  return {
    profileError,
    newUsername,
    submitPending,
    profilePending,
    setNewUsername,
    handleSubmit,
    user,
  };
};
