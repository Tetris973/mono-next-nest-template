import { HttpStatus } from '@web/common/enums/http-status.enum';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

/**
 * Represents a successful server action response.
 * @template T The type of the successful response data.
 */
export type ServerActionResponseSuccess<T> = { data: T; error?: never };

/**
 * Represents basic error information with an HTTP status code and a message.
 */
export type ServerActionResponseErrorInfo = {
  status: HttpStatus;
  message: string;
};

/**
 * Represents an error response from a server action.
 * @template E The type of the error details. Defaults to undefined if not specified, when no data is needed for error details.
 */
export type ServerActionResponseError<E = undefined> = { data?: E; error: ServerActionResponseErrorInfo };

/**
 * Represents an error response from a server action with DTO validation errors.
 * @template E The type of the DTO.
 */
export type ServerActionResponseErrorDto<E> = {
  data?: DtoValidationError<E>;
  error: ServerActionResponseErrorInfo;
};

/**
 * Represents the response structure for server actions.
 *
 * This type uses a discriminated union of ServerActionResponseSuccess and ServerActionResponseError
 * to ensure that a response is either a success (with data) or an error (with status and message),
 * but never both.
 *
 * @template T The type of the successful response data.
 * @template E The type of the error details. Defaults to undefined if not specified.
 *
 * @see ServerActionResponseSuccess
 * @see ServerActionResponseError
 *
 * @example
 * // Success case
 * const successResponse: ServerActionResponse<User> = {
 *   data: { id: 1, name: "John Doe" }
 * };
 *
 * // Error case
 * const errorResponse: ServerActionResponse<User, string> = {
 *   data: "Additional error context",
 *   error: { status: HttpStatus.NOT_FOUND, message: "User not found" }
 * };
 */
export type ServerActionResponse<T, E = undefined> = ServerActionResponseSuccess<T> | ServerActionResponseError<E>;

/**
 * A helper type for server action responses specifically tailored for DTOs with validation errors.
 * It simplifies typing by requiring only the DTO type T. The validation error type is automatically inferred.
 *
 * @template T The type of the DTO, extending Record<string, any>.
 *
 * The response can be either:
 * 1. A success response with the DTO data.
 * 2. An error response with DTO validation errors.
 *
 * Note: For non-DTO success responses or different error types, use ServerActionResponse<T, E> directly.
 *
 * @see ServerActionResponseSuccess
 * @see ServerActionResponseErrorDto
 * @see DtoValidationError
 *
 * @example
 * type UserDto = { name: string; age: number };
 *
 * // Success case
 * const successResponse: ServerActionResponseDto<UserDto> = {
 *   data: { name: "John Doe", age: 30 }
 * };
 *
 * // Error case with validation errors
 * const errorResponse: ServerActionResponseDto<UserDto> = {
 *   error: {
 *     status: HttpStatus.BAD_REQUEST,
 *     message: "Validation failed"
 *   },
 *   data: { name: ["Name is required"], age: ["Age must be a positive number"] }
 * };
 *
 * // Using ServerActionResponseDto in a function
 * function createUser(): ServerActionResponseDto<UserDto> {
 *   // Implementation
 * }
 *
 * // For non-DTO responses, use ServerActionResponse directly
 * function deleteUser(): ServerActionResponse<boolean, DtoValidationError<UserDto>> {
 *   // Implementation
 * }
 */
export type ServerActionResponseDto<T extends Record<string, any>> =
  | ServerActionResponseSuccess<T>
  | ServerActionResponseErrorDto<T>;

/**
 * Represents an error response from a server action with typed details.
 * @template T The type of the error details.
 */
export class ServerActionError<T = undefined> extends Error {
  /**
   * Creates a new ServerActionError.
   * @param status The HTTP status code of the error.
   * @param message The error message.
   * @param details Optional additional details about the error.
   */
  constructor(
    public readonly status: HttpStatus,
    public readonly message: string,
    public readonly details?: T,
  ) {
    super(message);
    this.name = 'ServerActionError';
  }
}
