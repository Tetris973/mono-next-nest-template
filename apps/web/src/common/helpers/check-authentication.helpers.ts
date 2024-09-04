import { cookies } from 'next/headers';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { ServerActionResponse } from '@web/common/types/server-action-response.type';

/**
 * Checks if the user is logged in by verifying the presence of an authentication token.
 *
 * @remarks
 * This action should never be called on the client side to get the token, as it is a breach of security.
 *
 * @returns - An object containing either the token or an error response.
 */
export const checkAuthentication = (): ServerActionResponse<string> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    return {
      error: {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Not authenticated',
      },
    };
  }

  return { data: token };
};
