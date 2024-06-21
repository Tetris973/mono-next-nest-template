import { validateUsername } from '@web/app/auth/validation-common';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';

export const validateUserProfileEditForm = (updateUserDto: UpdateUserDto): UpdateUserDto => {
  return {
    username: validateUsername(updateUserDto.username),
  };
};
