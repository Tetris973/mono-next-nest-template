import { HttpStatus } from '@web/app/common/http-status.enum';
import { ActionResponse } from '@web/app/common/action-response.type';

/**
 * Safe fetch utility function to handle fetch errors and provide a consistent error response.
 * @param url - The URL to fetch.
 * @param options - The options for the fetch request.
 * @returns - The fetch result containing either the response or an error.
 */
export const safeFetch = async (url: RequestInfo, options?: RequestInit): Promise<ActionResponse<Response>> => {
  try {
    const response = await fetch(url, options);
    return { result: response };
  } catch (error: any) {
    // Determine the type of error
    // TODO determine if the message are okay
    let message = 'An unknown error occurred. Please try again later.';
    if (error instanceof TypeError) {
      message = 'Network error or invalid URL.';
    } else if (error.name === 'AbortError') {
      message = 'Request was aborted.';
    } else if (error.message && error.message.includes('CORS')) {
      message = 'CORS error: The request was blocked by the browser due to same-origin policy.';
    }

    // Log the error for debugging
    console.error(`Fetch error: ${message}`, error);

    // Return a consistent error response
    return {
      error: {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Failed to connect to the server. Please try again later.',
      },
    };
  }
};
