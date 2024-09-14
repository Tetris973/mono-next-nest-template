import { HttpStatus } from '@web/common/enums/http-status.enum';
import type {
  ServerActionResponseError,
  ServerActionResponseErrorInfo,
} from '@web/common/types/server-action-response.type';
import { ResponseError } from '@web/lib/backend-api/index';
import { Logger } from 'pino';

/**
 * Helper to process unhandled errors in server actions.
 *
 * @description
 * This function is used to handle errors that are not explicitly managed within server actions.
 * It creates a standardized error response and logs the error for debugging purposes.
 *
 * @param message - The message that can be returned to the user client.
 * @param error - The original error object that was thrown.
 * @param logger - The logger instance used to log the error.
 * @returns A standardized error response object.
 */
export function standardizeAndLogError(message: string, error: unknown, logger: Logger): ServerActionResponseError {
  const errorInfo: ServerActionResponseErrorInfo = {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message,
  };

  if (error instanceof ResponseError) {
    errorInfo.status = error.response.status;
  }

  const responseError: ServerActionResponseError = { error: errorInfo };

  /**
   * Use ERROR for unhandled errors because they indicate a problem that prevents normal operation but doesn't crash the application.
   * This log is used to debug and add behavior for unhandled errors that may not have been considered in the endpoint.
   */
  logger.error({
    msg: 'Unhandled error in server action',
    responseError,
    /**
     * Currently this does not display lots of information like the stack trace or the response object
     * If needed usage of the logger or how the error is processed shall be improved
     */
    originalError: error,
  });

  return responseError;
}
