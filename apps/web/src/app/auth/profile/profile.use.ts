import { useState, useEffect } from 'react';
import { validateUserProfileEditForm } from './validation';
import {
  getUserByIdAction as defaultGetUserByIdAction,
  updateUserAction as defaultUpdateUserAction,
} from '@web/app/user/user.service';
import { UserDto } from '@dto/modules/user/dto/user.dto';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { UpdateUserDto } from '@dto/modules/user/dto/update-user.dto';
import { FormSubmitResult } from '@web/common/interfaces/form-submit-result.interface';
import { useServerAction } from '@web/common/helpers/server-action.use';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

export interface UseProfileForm {
  profileError: DtoValidationError<UpdateUserDto>;
  submitPending: boolean;
  profilePending: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<FormSubmitResult>;
  user: UserDto | null;
}

export interface UseProfileFormDependencies {
  getUserByIdAction?: typeof defaultGetUserByIdAction;
  updateUserAction?: typeof defaultUpdateUserAction;
}

export const useProfileForm = (
  userId: number,
  {
    getUserByIdAction = defaultGetUserByIdAction,
    updateUserAction = defaultUpdateUserAction,
  }: UseProfileFormDependencies = {},
): UseProfileForm => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [profileError, setProfileError] = useState<DtoValidationError<UpdateUserDto>>({ username: [] });
  const [submitPending, updateUserActionM] = useServerAction(updateUserAction);
  const [profilePending, getProfileActionM] = useServerAction(getUserByIdAction);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { result, error } = await getProfileActionM(userId);
      if (error) {
        // Nothing when error for the moment
      } else {
        setUser(result);
      }
    };

    fetchUserProfile();
  }, [userId, getProfileActionM]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<FormSubmitResult> => {
    if (!user) return { error: 'No user selected, cannot update profile' };
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = (formData.get('username') as string).trim();

    const validationErrors = validateUserProfileEditForm({ username });
    if (validationErrors) {
      setProfileError(validationErrors);
      return {};
    }

    const { result, error } = await updateUserActionM(user.id, { username });
    if (error) {
      if (error.status === HttpStatus.CONFLICT) {
        setProfileError({ username: [error.message] });
        return {};
      }
      return { error: error.message };
    }
    setUser(result);
    setProfileError({ username: [] });
    return { success: `Profile of ${username} updated successfully` };
  };

  return {
    profileError,
    submitPending,
    profilePending,
    handleSubmit,
    user,
  };
};
