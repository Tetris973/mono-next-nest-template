import { HttpStatus } from '@web/app/constants/http-status';

export interface LoginFormError {
  message: string;
  code?: HttpStatus;
}
