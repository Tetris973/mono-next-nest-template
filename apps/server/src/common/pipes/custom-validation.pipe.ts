import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * Maps validation errors to a more readable format.
 *
 * @param {ValidationError[]} errors - Array of validation errors.
 * @returns {Record<string, unknown>} - Formatted error messages.
 * @example
 *
 * Output:
 *  {
 *    name: ['name should not be empty', 'name must be a string'],
 *    email: ['email should not be empty', 'email must be an email'],
 *    password: [
 *      'password too weak', 'password must be longer than or equal to 8 characters',
 *      'password must be a string'
 *    ],
 *    posts: {
 *      0: {
 *        title: ['title should not be empty'],
 *        content: ['content should not be empty']
 *      }
 *    }
 *  }
 */
export const mapValidationErrors = (errors: ValidationError[]): Record<string, unknown> => {
  /**
   * Recursively formats validation errors.
   *
   * @param {ValidationError[]} errors - Array of validation errors.
   * @returns {Record<string, unknown>} - Formatted error messages.
   */
  const formatValidationErrors = (errors: ValidationError[]): Record<string, unknown> => {
    const formattedErrors: Record<string, unknown> = {};

    errors.forEach((error: ValidationError) => {
      if (error.children && error.children.length > 0) {
        // Format nested errors
        formattedErrors[error.property] = formatValidationErrors(error.children);
      } else {
        // Format simple errors
        formattedErrors[error.property] = Object.values(error.constraints || {});
      }
    });

    return formattedErrors;
  };

  return formatValidationErrors(errors);
};

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super(validationErrors);
  }
}

/**
 * Factory for creating a validation exception for the ValidationPipe.
 *
 * @param {ValidationError[]} errors - Array of validation errors.
 * @returns {ValidationException} - Validation exception.
 */
export const validationExceptionFactory = (errors: ValidationError[]) => {
  return new ValidationException(mapValidationErrors(errors));
};

/**
 * Validation pipe for validating the request body.
 * Used to validate  all incoming request using a DTO with class-validator
 */
export const customValidationPipe = new ValidationPipe({
  exceptionFactory: validationExceptionFactory,
  // Strip unknown properties from the request body
  whitelist: true,
  // Transform the request body to the DTO instance
  transform: true,
});
