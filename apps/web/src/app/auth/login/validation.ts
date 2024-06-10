// app/auth/login/validation.ts

import { validateUsername, validatePassword } from '@web/app/auth/validation-common';

export const validateLoginForm = (username: string, password: string): { username: string; password: string } => {
  return {
    username: validateUsername(username),
    password: validatePassword(password),
  };
};
