import { HttpStatus } from '@web/common/enums/http-status.enum';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

/**
 * Utility type to check if T is an object-like structure.
 */
type IsObject<T> = T extends object ? (T extends any[] ? false : true) : false;

/**
 * Represents an error response from an API action.
 *
 * @template D - The type of additional details about the error, usually validation errors.
 */
export type ActionErrorResponse<D = undefined> = {
  /**
   * A descriptive message providing details about the error.
   */
  message: string;
  /**
   * The HTTP status code associated with the error.
   */
  status: HttpStatus;
  /**
   * The details of the error.
   * If D is not given, then the default is undefined and so details is not present.
   * If D is an object, then the details are a DtoValidationError.
   * If D is a string, then the details are a string.
   */
  details?: D extends undefined ? never : IsObject<D> extends true ? DtoValidationError<D> : string;
};

/**
 * Represents a response from a server action.
 * Either `result` or `error` must be specified, but not both.
 *
 * @template T - The type of the successful result of the server action.
 * @template D - The type of additional details about the error, usually validation errors.
 *
 * @example
 * type UserDto = {
 *   username: string;
 *   password: string;
 * };
 *
 * let actionResponse: ActionResponse<UserDto, UserDto>;
 *
 * // Successful response with a result
 * actionResponse = {
 *   result: {
 *     username: 'test',
 *     password: 'test',
 *   },
 * };
 *
 * // Error response with details
 * actionResponse = {
 *   error: {
 *     message: 'Validation error',
 *     status: HttpStatus.BAD_REQUEST,
 *     details: { password: ['Incorrect password'] },
 *   },
 * };
 *
 * @property result - The successful result of the server action.
 * @property error - The error information if the server action fails.
 */
export type ActionResponse<T, D = undefined> =
  | { result: T; error?: never }
  | { result?: never; error: ActionErrorResponse<D> };
