import { HttpStatus } from '@web/common/enums/http-status.enum';
import { ServerActionResponse } from '@web/common/types/action-response.type';
import { getLogger } from '@web/lib/logger';
import { logoutAction } from '@web/app/auth/logout/logout.service';

const logger = getLogger('safeFetch');

/**
 * Safe fetch utility function to handle fetch errors and provide a consistent error response.
 * @param url - The URL to fetch.
 * @param options - The options for the fetch request.
 * @returns - The fetch result containing either the response or an error.
 */
export const safeFetch = async (url: RequestInfo, options?: RequestInit): Promise<ServerActionResponse<Response>> => {
  try {
    const response = await fetch(url, options);
    if (response.status === HttpStatus.UNAUTHORIZED) {
      const responseBody = await response.json();
      // This can happen when user has a valid jwt but the user was deleted in database.
      if (responseBody.message === 'User not found during JWT validation') {
        await logoutAction();
        return {
          error: {
            status: HttpStatus.UNAUTHORIZED,
            message: 'User session expired. Please log in again.',
          },
        };
      }
    }
    return { data: response };
  } catch (error: any) {
    // Determine the type of error
    let message = 'An unknown error occurred!';
    if (error instanceof TypeError) {
      message = 'Network error or invalid URL.';
    } else if (error.name === 'AbortError') {
      message = 'Request was aborted.';
    } else if (error.message && error.message.includes('CORS')) {
      message = 'CORS error: The request was blocked by the browser due to same-origin policy.';
    }
    logger.error(error, `Fetch error: ${message}`);

    // Return a consistent error response
    return {
      error: {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Failed to connect to the server. Please try again later.',
      },
    };
  }
};
