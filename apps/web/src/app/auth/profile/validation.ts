import { validateUsername } from '@web/app/auth/validation-common';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';
import { DtoValidationError } from '@web/app/common/dto-validation-error.type';

export const validateUserProfileEditForm = (updateUserDto: UpdateUserDto): DtoValidationError<UpdateUserDto> | null => {
  const errors = {
    username: validateUsername(updateUserDto.username),
  };

  if (Object.values(errors).every((error) => error.length === 0)) {
    return null;
  }
  return errors;
};
