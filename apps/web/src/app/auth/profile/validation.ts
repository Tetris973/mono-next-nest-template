import { UpdateUserDto } from '@dto/modules/user/dto/update-user.dto';
import { UseFormInput } from '@mantine/form';
import { z } from 'zod';

export const usernameSchema = z.string().min(6, 'Username must be at least 6 characters.');

export const validateUserProfileEditForm: UseFormInput<UpdateUserDto>['validate'] = {
  username: (value) => {
    const result = usernameSchema.safeParse(value);
    return result.success ? null : result.error.errors[0].message;
  },
};
