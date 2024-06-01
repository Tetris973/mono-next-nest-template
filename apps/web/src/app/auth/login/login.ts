// app/auth/login/login.ts

'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { LoginFormError } from '@web/app/common/form-error.interface';
import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/constants/http-status';

const setAuthCookie = (response: Response) => {
  const setCookieHeader = response.headers.get('Set-Cookie');
  if (setCookieHeader) {
    const token = setCookieHeader.split(';')[0].split('=')[1];
    cookies().set({
      name: 'Authentication',
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(token).exp! * 1000),
    });
  }
};

const getErrorMessage = (status: number, parsedRes: any): LoginFormError | null => {
  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      return { message: 'Incorrect password', code: HttpStatus.UNAUTHORIZED };
    case HttpStatus.BAD_REQUEST:
      if (Array.isArray(parsedRes.message)) {
        if (parsedRes.message.some((msg: string) => msg.includes('username must be'))) {
          return { message: 'User not found', code: HttpStatus.NOT_FOUND };
        }
        if (parsedRes.message.includes('password is not strong enough')) {
          return { message: 'Password is not strong enough', code: HttpStatus.UNAUTHORIZED };
        }
      }
      return { message: 'Invalid request', code: HttpStatus.BAD_REQUEST };
    case HttpStatus.NOT_FOUND:
      return { message: 'User not found', code: HttpStatus.NOT_FOUND };
    default:
      return { message: 'An unexpected error occurred, please try again', code: status };
  }
};

export const login = async (loginData: FormData): Promise<LoginFormError | null> => {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(loginData)),
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      message: 'Failed to connect to the server. Please try again later.',
      code: HttpStatus.SERVICE_UNAVAILABLE,
    };
  }

  if (res.ok) {
    setAuthCookie(res);
    return null;
  }

  const parsedRes = await res.json();
  return getErrorMessage(res.status, parsedRes);
};
