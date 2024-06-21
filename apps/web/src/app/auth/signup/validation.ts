import { validateUsername, validatePassword, validateConfirmPassword } from '@web/app/auth/validation-common';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';

export const validateSignupForm = (createUserDto: CreateUserDto): CreateUserDto => {
  return {
    username: validateUsername(createUserDto.username),
    password: validatePassword(createUserDto.password),
    confirmPassword: validateConfirmPassword(createUserDto.confirmPassword, createUserDto.password),
  };
};
