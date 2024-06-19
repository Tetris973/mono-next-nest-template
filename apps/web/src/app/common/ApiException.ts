import { HttpStatus } from '@web/app/constants/http-status.enum';

export class ApiException extends Error {
  status: HttpStatus;
  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ServiceUnavailableException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class BadRequestException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ConflictException extends ApiException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
