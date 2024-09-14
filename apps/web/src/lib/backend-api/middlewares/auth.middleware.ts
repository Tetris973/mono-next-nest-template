import { checkAuthentication } from '@web/common/helpers/check-authentication.helpers';
import { Middleware } from '@mono-next-nest-template/backend-api-sdk';

/**
 * Middleware to automatically add the authentication token to API requests.
 *
 * @description
 * The `authMiddleware` ensures that the authentication token is included in all API calls made through the generated SDK.
 * It appends the token to the 'Cookie' header of the request while preserving any existing cookies.
 *
 * Note:
 * - If the authentication token is not available, the middleware passes the request through without modifying the headers.
 * - Error handling for unauthorized responses is handled separately by the error middleware.
 *
 * Caution:
 * - Using `initOverride` in an API call will override the headers set by this middleware for that specific call.
 *
 */
export const authMiddleware: Middleware = {
  pre: async (context) => {
    const { data: token } = checkAuthentication();
    if (token) {
      const headers = new Headers(context.init.headers);
      const existingCookie = headers.get('Cookie') || '';
      const newCookie = existingCookie ? `${existingCookie}; Authentication=${token}` : `Authentication=${token}`;
      headers.set('Cookie', newCookie);
      context.init.headers = headers;
    }
    return context;
  },
};
