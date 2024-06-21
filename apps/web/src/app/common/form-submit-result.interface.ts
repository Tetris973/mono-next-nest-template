/**
 * Interface representing the result of a form submission.
 *
 * This interface is used as the return type of form submission methods.
 * - `success`: Indicates a successful submission.
 * - `error`: Indicates an HTTP error from the backend.
 * - Both `success` and `error` are empty: Indicates client-side validation failure.
 */
export interface FormSubmitResult {
  error?: string;
  success?: string;
}
