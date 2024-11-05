'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { ServerActionResponse } from '@web/common/types/server-action-response.type';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { Role } from '@web/app/auth/role.enum';
import { JwtPayload } from '@web/app/auth/jwt-payload.interface';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';
import { getLogger } from '@web/lib/logger';
import { backendApi, StandardizedApiError, ResponseError, LoginUserDto } from '@web/lib/backend-api/index';
import { standardizeAndLogError } from '@web/common/helpers/unhandled-server-action-error.helper';

const logger = getLogger('Login.service');

/**
 * Set the authentication cookie from the response.
 * @param response - The response from the login request.
 */
const setAuthCookie = (response: Response) => {
  const setCookieHeader = response.headers.get('Set-Cookie');
  if (!setCookieHeader) {
    throw new Error('No Set-Cookie header found in the response');
  }

  const token = setCookieHeader.split(';')[0].split('=')[1];
  const decodedToken = jwtDecode<JwtPayload>(token);
  if (!decodedToken.exp) {
    throw new Error('Token does not have an expiration date');
  }

  const SECONDS_TO_MILLISECONDS = 1000;
  cookies().set({
    name: 'Authentication',
    value: token,
    // Warning: safari does not allow secure cookie to be set over http
    secure: true,
    sameSite: 'strict',
    httpOnly: true,
    expires: new Date(decodedToken.exp * SECONDS_TO_MILLISECONDS),
  });
};

export const loginAction = async (
  loginData: LoginUserDto,
): Promise<ServerActionResponse<undefined, DtoValidationError<LoginUserDto>>> => {
  try {
    const { raw: response } = await backendApi.authControllerLoginRaw({ loginUserDto: loginData });
    try {
      setAuthCookie(response);
    } catch (error) {
      logger.fatal(error, 'Error setting authentication cookie');
      return {
        error: { message: 'An unexpected error occurred, please try again', status: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
    return { data: undefined };
  } catch (error: unknown) {
    if (error instanceof StandardizedApiError) return { error: error.uiErrorInfo };

    if (error instanceof ResponseError) {
      if (error.response.status === HttpStatus.UNAUTHORIZED) {
        return {
          error: { message: 'Unauthorized', status: HttpStatus.UNAUTHORIZED },
          data: { password: ['Incorrect password'] },
        };
      }

      if (error.response.status === HttpStatus.NOT_FOUND) {
        return {
          error: { message: 'Unauthorized', status: HttpStatus.NOT_FOUND },
          data: { username: ['User not found'] },
        };
      }

      if (error.response.status === HttpStatus.BAD_REQUEST) {
        const errorData = await error.response.json();
        return {
          error: { message: 'Validation error', status: HttpStatus.BAD_REQUEST },
          data: errorData,
        };
      }
    }

    return standardizeAndLogError('Failed to login', error, logger);
  }
};

export const isAuthenticatedAction = async (): Promise<boolean> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;
  return !!token;
};

export const getRolesAction = async (): Promise<Role[]> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value || '';
  if (!token) {
    return [];
  }
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken.roles;
  } catch (err) {
    logger.error({ err }, 'Error decoding token for roles');
    return [];
  }
};
