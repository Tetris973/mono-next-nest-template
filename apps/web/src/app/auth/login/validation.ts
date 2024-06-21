import { validateUsername, validatePassword } from '@web/app/auth/validation-common';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';

export const validateLoginForm = (loginDto: LoginUserDto): LoginUserDto => {
  return {
    username: validateUsername(loginDto.username),
    password: validatePassword(loginDto.password),
  };
};
