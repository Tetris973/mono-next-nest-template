// src/app/auth/profile/profile.service.ts

'use server';

import { cookies } from 'next/headers';
import { API_URL } from '@web/app/constants/api';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { HttpStatus } from '@web/app/constants/http-status.enum';
import { User } from '@web/app/user/user.interface';

export async function getProfileAction(): Promise<User | ActionErrorResponse> {
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
      message: 'Failed to fetch profile',
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
