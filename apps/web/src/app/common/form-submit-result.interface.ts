/**
 * Interface representing the result of a form submission.
 *
 * This interface is used as the return type of form submission methods.
 * - `success`: Indicates a successful submission.
 * - `error`: Indicates an HTTP error from the backend.
 * - Both `success` and `error` are empty: Indicates client-side validation failure.
 *
 * @typedef {Object} FormSubmitResult
 * @property {string} [success] - The success message if the form submission is successful.
 * @property {string} [error] - The error message if there is an HTTP error from the backend.
 */
export type FormSubmitResult =
  | {
      error?: never;
      success: string;
    }
  | {
      error: string;
      success?: never;
    }
  | Record<string, never>;
