'use server';

import { cookies } from 'next/headers';
import { API_URL } from '@web/app/constants/api';
import { UserDto } from '@dto/user/dto/user.dto';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { HttpStatus } from '@web/app/common/http-status.enum';

export async function getProfileAction(): Promise<UserDto | ActionErrorResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    return {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Not authenticated',
    };
  }

  let response;
  try {
    response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Cookie: `Authentication=${token}`,
      },
    });
  } catch (error) {
    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Failed to connect to the server. Please try again later.',
    };
  }

  if (!response.ok) {
    return {
      status: response.status,
      message: 'Failed to fetch profile',
    };
  }

  return response.json();
}
