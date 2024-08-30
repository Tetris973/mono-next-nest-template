import { validateUsername, validatePassword, validateConfirmPassword } from '@web/common/validations/validation';
import { CreateUserDto } from '@dto/modules/user/dto/create-user.dto';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

export const validateSignupForm = (createUserDto: CreateUserDto): DtoValidationError<CreateUserDto> | null => {
  const errors = {
    username: validateUsername(createUserDto.username),
    password: validatePassword(createUserDto.password),
    confirmPassword: validateConfirmPassword(createUserDto.confirmPassword, createUserDto.password),
  };
  if (Object.values(errors).every((error) => error.length === 0)) {
    return null;
  }
  return errors;
};
