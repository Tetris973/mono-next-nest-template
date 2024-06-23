import { HttpStatus } from './http-status.enum';

/**
 * Represents an error response from an API action.
 * @typedef {Object} ActionErrorResponse
 * @property {string} message - A descriptive message providing details about the error.
 * @property {HttpStatus} status - The HTTP status code associated with the error.
 */
export type ActionErrorResponse = {
  message: string;
  status: HttpStatus;
};

/**
 * Represents a response from a server action.
 * Either `result` or `error` must be specified, but not both.
 *
 * @typedef {Object} ActionResponse
 * @template T
 * @property {T} [result] - The successful result of the server action. Present when the server action is successful.
 * @property {ActionErrorResponse} [error] - The error information if the server action fails. Present when the server action encounters an error.
 */
export type ActionResponse<T> = { result: T; error?: never } | { result?: never; error: ActionErrorResponse };
