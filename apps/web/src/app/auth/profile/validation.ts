import { validateUsername } from '@web/common/validations/validation';
import { UpdateUserDto } from '@dto/modules/user/dto/update-user.dto';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

export const validateUserProfileEditForm = (updateUserDto: UpdateUserDto): DtoValidationError<UpdateUserDto> | null => {
  const errors = {
    username: validateUsername(updateUserDto.username),
  };

  if (Object.values(errors).every((error) => error.length === 0)) {
    return null;
  }
  return errors;
};
