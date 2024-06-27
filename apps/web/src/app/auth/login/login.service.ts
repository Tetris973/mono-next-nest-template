'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { ActionErrorResponse, ActionResponse } from '@web/app/common/action-response.type';
import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { Role } from '@web/app/auth/role.enum';
import { JwtPayload } from '@web/app/auth/jwt-payload.interface';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';
import { DtoValidationError } from '@web/app/common/dto-validation-error.type';

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
    secure: true,
    httpOnly: true,
    expires: new Date(decodedToken.exp * SECONDS_TO_MILLISECONDS),
  });
};

/**
 * Format the login error response based on the status code.
 */
const formatLoginError = (
  status: HttpStatus,
  parsedRes: DtoValidationError<LoginUserDto>,
): ActionErrorResponse<LoginUserDto> => {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return { message: 'Validation error', status, details: parsedRes };
    case HttpStatus.UNAUTHORIZED:
      return { message: 'Unauthorized', status, details: { password: ['Incorrect password'] } };
    case HttpStatus.NOT_FOUND:
      return { message: 'Unauthorized', status, details: { username: ['User not found'] } };
    default:
      return { message: 'An unexpected error occurred, please try again', status };
  }
};

export const loginAction = async (loginData: LoginUserDto): Promise<ActionResponse<null, LoginUserDto>> => {
  const { result: res, error } = await safeFetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
  });

  if (error) {
    return { error };
  }

  if (res.ok) {
    try {
      setAuthCookie(res);
    } catch (error) {
      console.error('Fatal Error setting authentication cookie', error);
      return {
        error: { message: 'An unexpected error occurred, please try again', status: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
    return { result: null };
  }

  const parsedRes = await res.json();
  return { error: formatLoginError(res.status, parsedRes) };
};

export const isAuthenticatedAction = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;
  return !!token;
};

export const getRolesAction = (): Role[] => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value || '';
  if (!token) {
    return [];
  }
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken.roles;
  } catch (error) {
    console.error('Error decoding token for roles', error);
    return [];
  }
};
