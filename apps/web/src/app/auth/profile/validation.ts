import { validateUsername } from '@web/app/auth/validation-common';

export const validateUserProfileEditForm = (username: string): { username: string } => {
  return {
    username: validateUsername(username),
  };
};
