import { Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FieldAlreadyInUseException } from './common/field-already-In-use.exception';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let catchedException = null;

    if (exception instanceof FieldAlreadyInUseException) {
      catchedException = new ConflictException(exception.message);
    }
    super.catch(catchedException || exception, host);
  }
}
