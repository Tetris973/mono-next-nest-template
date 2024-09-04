import { useEffect } from 'react';
import { profileFormSchema } from './validation';
import { zodResolver } from 'mantine-form-zod-resolver';
import {
  getUserByIdActionNew as defaultGetUserByIdAction,
  updateUserAction as defaultUpdateUserAction,
} from '@web/app/user/user.service';
import { UserDto, UpdateUserDto } from '@web/common/dto/backend-index.dto';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { FormSubmitResult } from '@web/common/interfaces/form-submit-result.interface';
import { useServerAction } from '@web/common/helpers/server-action.hook';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useServerActionSWR } from '@web/common/helpers/server-action-swr.hook';

export interface UseProfileForm {
  submitPending: boolean;
  profilePending: boolean;
  handleSubmit: (updateUserDto: UpdateUserDto) => Promise<FormSubmitResult>;
  user?: UserDto;
  form: UseFormReturnType<UpdateUserDto>;
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
  const [submitPending, updateUserActionM] = useServerAction(updateUserAction);

  const {
    data: user,
    isLoading: profilePending,
    mutate: mutateUser,
  } = useServerActionSWR(`getUserById/${userId}`, () => getUserByIdAction(userId));

  const form = useForm<UpdateUserDto>({
    initialValues: {
      username: '',
    },
    validate: zodResolver(profileFormSchema),
  });
  const setFormValues = form.setValues;

  useEffect(() => {
    if (user) {
      setFormValues({ username: user.username });
    }
  }, [user, setFormValues]);

  const handleSubmit = async (updateUserDto: UpdateUserDto): Promise<FormSubmitResult> => {
    if (!user) return { error: 'No user selected, cannot update profile' };

    const { data, error } = await updateUserActionM(user.id, updateUserDto);
    if (error) {
      if (error.status === HttpStatus.CONFLICT) {
        form.setFieldError('username', error.message);
        return {};
      }
      return { error: error.message };
    }
    mutateUser(data);
    return { success: `Profile of ${data.username} updated successfully` };
  };

  return {
    form,
    submitPending,
    profilePending,
    handleSubmit,
    user,
  };
};
