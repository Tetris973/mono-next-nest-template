'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { ActionResponse } from '@web/app/common/action-response.type';
import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { Role } from '@web/app/auth/role.enum';
import { IJwtPayload } from '@web/app/auth/jwt-payload.interface';
import { logoutAction } from '../logout/logout.service';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';

const setAuthCookie = (response: Response) => {
  const setCookieHeader = response.headers.get('Set-Cookie');
  if (setCookieHeader) {
    const token = setCookieHeader.split(';')[0].split('=')[1];
    cookies().set({
      name: 'Authentication',
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(token).exp! * 1000), // TODO: check if expiration is correct
    });
  }
};

const getErrorMessage = (status: number, parsedRes: any): ActionResponse<null> => {
  let isUsernameError = false;
  let isPasswordError = false;
  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      return { error: { message: 'Incorrect password', status: HttpStatus.UNAUTHORIZED } };
    case HttpStatus.BAD_REQUEST:
      isUsernameError = parsedRes.message.some((msg: string) => msg.includes('username must be'));
      isPasswordError = parsedRes.message.includes('password is not strong enough');

      if (isUsernameError) {
        return { error: { message: 'User not found', status: HttpStatus.NOT_FOUND } };
      }
      if (isPasswordError) {
        return { error: { message: 'Password is not strong enough', status: HttpStatus.UNAUTHORIZED } };
      }

      return { error: { message: 'Invalid request', status: HttpStatus.BAD_REQUEST } };

    case HttpStatus.NOT_FOUND:
      return { error: { message: 'User not found', status: HttpStatus.NOT_FOUND } };
    default:
      return { error: { message: 'An unexpected error occurred, please try again', status } };
  }
};

export const loginAction = async (loginData: LoginUserDto): Promise<ActionResponse<null>> => {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
  } catch (error) {
    return {
      error: {
        message: 'Failed to connect to the server. Please try again later.',
        status: HttpStatus.SERVICE_UNAVAILABLE,
      },
    };
  }

  if (res.ok) {
    setAuthCookie(res);
    return { result: null };
  }

  const parsedRes = await res.json();
  return getErrorMessage(res.status, parsedRes);
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
    const decodedToken = jwtDecode<IJwtPayload>(token);
    return decodedToken.roles;
  } catch (error) {
    logoutAction();
    return [];
  }
};
