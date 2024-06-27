import { validateUsername, validatePassword } from '@web/app/auth/validation-common';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';
import { DtoValidationError } from '@web/app/common/dto-validation-error.type';

export const validateLoginForm = (loginDto: LoginUserDto): DtoValidationError<LoginUserDto> | null => {
  const errors = {
    username: validateUsername(loginDto.username),
    password: validatePassword(loginDto.password),
  };

  if (Object.values(errors).every((error) => error.length === 0)) {
    return null;
  }
  return errors;
};
