import { Catch, ArgumentsHost, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FieldAlreadyInUseException } from './field-already-in-use.exception';
import { UserNotFoundException } from './user-not-found.exception';
import { InvalidCredentialsException } from './invalid-credentials.exception';

/**
 * Global exception filter that catches all exceptions
 * and transforms specific custom exceptions into standard HTTP exceptions.
 */
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  /**
   * Catches and handles exceptions
   * @param exception The thrown exception
   * @param host The arguments host
   */
  catch(exception: unknown, host: ArgumentsHost) {
    let catchedException = null;

    // Transform FieldAlreadyInUseException into ConflictException
    if (exception instanceof FieldAlreadyInUseException) {
      catchedException = new ConflictException(exception.message);
    } else if (exception instanceof UserNotFoundException) {
      catchedException = new NotFoundException(exception.message);
    } else if (exception instanceof InvalidCredentialsException) {
      catchedException = new UnauthorizedException(exception.message);
    }

    // Pass the transformed exception (if any) or the original exception to the base filter
    super.catch(catchedException || exception, host);
  }
}
