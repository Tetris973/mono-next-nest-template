import { validateUsername, validatePassword, validateConfirmPassword } from '@web/app/auth/validation-common';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';
import { DtoValidationError } from '@web/app/common/dto-validation-error.type';

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
