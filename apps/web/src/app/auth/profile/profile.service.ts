'use server';

import { cookies } from 'next/headers';
import { API_URL } from '@web/app/constants/api';
import { User } from '@web/app/user/user.interface';
import { UnauthorizedException, ServiceUnavailableException, ApiException } from '@web/app/common/ApiException';

export const getProfileAction = async (): Promise<User> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    throw new UnauthorizedException('Not authenticated');
  }

  let response;
  try {
    response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Cookie: `Authentication=${token}`,
      },
    });
  } catch (error) {
    throw new ServiceUnavailableException('Failed to fetch profile');
  }

  if (!response.ok) {
    throw new ApiException('Failed to fetch profile', response.status);
  }

  return response.json();
};
