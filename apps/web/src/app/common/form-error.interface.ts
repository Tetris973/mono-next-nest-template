import { HttpStatus } from '@web/app/constants/http-status.enum';

export interface LoginFormError {
  message: string;
  code?: HttpStatus;
}
