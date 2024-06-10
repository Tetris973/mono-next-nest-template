// src/app/auth/profile/profile.service.ts

'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@web/app/constants/api';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { HttpStatus } from '@web/app/constants/http-status';

interface Profile {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export async function getProfileAction(): Promise<Profile | ActionErrorResponse> {
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

export async function updateProfileAction(username: string): Promise<Profile | ActionErrorResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value || '';

  if (!token) {
    return {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Auth cookie missing, not authenticated',
    };
  }

  let userId;
  try {
    const decodedToken = jwtDecode(token) as { sub: string };
    userId = decodedToken.sub;
  } catch (error) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Invalid token',
    };
  }

  if (!userId) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Invalid token: user ID not found',
    };
  }

  let response;
  try {
    response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Cookie: `Authentication=${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
  } catch (error) {
    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Failed to update profile',
    };
  }

  if (!response.ok) {
    if (response.status === HttpStatus.CONFLICT) {
      return {
        status: response.status,
        message: 'Username already exists',
      };
    }
    return {
      status: response.status,
      message: 'Failed to update profile',
    };
  }

  return response.json();
}
