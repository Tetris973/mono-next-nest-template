import { validateUsername, validatePassword } from '@web/common/validations/validation';
import { LoginUserDto } from '@web/common/dto/backend-index.dto';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

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
