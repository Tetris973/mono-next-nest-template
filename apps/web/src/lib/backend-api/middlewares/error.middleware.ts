import { ServerActionResponseErrorInfo } from '@web/common/types/server-action-response.type';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { logoutAction } from '@web/app/auth/logout/logout.service';
import { Middleware, ResponseError } from '@mono-next-nest-template/backend-api-sdk';
import { getLogger } from '@web/lib/logger';

const logger = getLogger('errorMiddleware');

/**
 * Represents standardized errors from the backend API for consistent UI handling.
 *
 * @description
 * This class serves multiple purposes:
 * 1. It provides a uniform structure for errors that can be safely displayed to users.
 * 2. It allows for centralized error handling in server actions and API calls.
 * 3. It facilitates easy differentiation between handled (common) errors and unhandled errors.
 *
 * Use cases:
 * - In API middleware to standardize common errors (e.g., network issues, authentication failures).
 * - In server actions to directly return structured errors to the UI.
 * - To distinguish between errors that can be shown to users and those that require further handling.
 *
 * @example
 * try {
 *   await api.someApiCall();
 * } catch (error) {
 *   if (error instanceof StandardizedApiError) {
 *     return { error: error.uiErrorInfo };
 *   }
 *   // Handle other types of errors...
 * }
 */
export class StandardizedApiError extends Error {
  override name = 'StandardizedApiError' as const;

  /**
   * Error information intended for display to the user interface.
   *
   * @description
   * The `uiErrorInfo` property contains error details that are safe and appropriate to show to end-users.
   * This information is typically used to provide user-friendly error messages and guide users on how to resolve issues.
   *
   * The purpose of separating UI error information is to:
   * 1. Ensure sensitive or technical details are not exposed to users.
   * 2. Provide a consistent and user-friendly error experience across the application.
   * 3. Decouple the internal error representation from what is displayed to users.
   *
   * When an error occurs, the `uiErrorInfo` can be directly passed to the UI layer for rendering error messages,
   * without the need for additional filtering or transformation.
   *
   * @type {ServerActionResponseErrorInfo}
   */
  constructor(public uiErrorInfo: ServerActionResponseErrorInfo) {
    super(uiErrorInfo.message);
  }
}

/**
 * Standardizes fetch errors to mimic the generated client SDK behavior.
 *
 * @description
 * Converts standard Errors into CommonKnownErrors to emulate the generated SDK.
 * This allows errorInfo to be directly set on the error object to be returned to the UI.
 *
 * @note The data thrown with the error are destined to the UI, therefore should not contain any sensitive information.
 *
 * @returns A CommonKnownError if the error is standardized, null otherwise.
 */
const handleCommonFetchError = async (error: unknown): Promise<StandardizedApiError | null> => {
  if (error instanceof Error) {
    return new StandardizedApiError({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Failed to connect to the server. Please try again later.',
    });
  }
  return null;
};

/**
 * Checks for specific error conditions in API responses that are common to all api calls.
 *
 * @description
 * Examines API responses for common errors (e.g., expired sessions) before
 * they reach the general error handling flow. This centralizes business logic
 * for common error scenarios across different API calls.
 *
 * @returns A CommonKnownError for handled cases, null otherwise to allow the original error to propagate.
 */
const handleCommonResponseError = async (response: Response): Promise<StandardizedApiError | null> => {
  if (response.status === HttpStatus.UNAUTHORIZED) {
    const responseBody = await response.json();
    /**
     * This can happen when user has a valid jwt but the user was deleted in database.
     */
    if (responseBody.message === 'User not found during JWT validation') {
      await logoutAction(); // We delete the auth cookie to prevent this error to happen again and prompt the user to log in again.
      return new StandardizedApiError({
        status: HttpStatus.UNAUTHORIZED,
        message: 'User session expired. Please log in again.',
      });
    }
    return new StandardizedApiError({
      status: HttpStatus.UNAUTHORIZED,
      message: 'Not authenticated',
    });
  }
  return null;
};

export const errorMiddleware: Middleware = {
  /**
   * This middleware is used to handle errors that occur during the fetch call in the backend api sdk.
   * It either throw a CommonKnownError or the original error.
   */
  onError: async (context) => {
    const commonFetchError = await handleCommonFetchError(context.error);
    if (commonFetchError) {
      /**
       * Use ERROR for fetch errors because they indicate a problem that prevents normal operation but doesn't crash the application.
       */
      logger.error(
        { commonFetchError, onErrorContext: context },
        'Call to backend api fetch failed with a common known error',
      );
      throw commonFetchError;
    }
    throw context.error;
  },
  /**
   * This middleware is used to handle error status code from the response of the fetch call in the backend api sdk.
   * It either throw a CommonKnownError or the original error.
   */
  post: async (context) => {
    const response = context.response;
    if (response && response.status >= 200 && response.status < 300) {
      return response;
    }

    const commonReponseError = await handleCommonResponseError(response);
    if (commonReponseError) {
      /**
       * Use WARN for known response errors because they are automatically handled and do not interrupt normal operation but might require attention.
       */
      logger.warn(
        { commonReponseError, postContext: context },
        'Response from the backend api returned a common known error',
      );
      throw commonReponseError;
    }
    throw new ResponseError(response, 'Response returned an error code');
  },
};
