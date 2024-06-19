'use server';

import { API_URL } from '@web/app/constants/api';
import { cookies } from 'next/headers';
import { User } from '@web/app/user/user.interface';
import { HttpStatus } from '@web/app/constants/http-status.enum';
import {
  UnauthorizedException,
  ServiceUnavailableException,
  BadRequestException,
  ConflictException,
  ApiException,
} from '@web/app/common/ApiException';

export const getUserByIdAction = async (id: string): Promise<User> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    throw new UnauthorizedException('Not authenticated');
  }

  let response;
  try {
    response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
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

export const updateUserAction = async (userId: string, username: string): Promise<User> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    throw new UnauthorizedException('Auth cookie missing, not authenticated');
  }

  if (!userId) {
    throw new BadRequestException('Invalid token: user ID not found');
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
    throw new ServiceUnavailableException('Service unavailable');
  }

  if (!response.ok) {
    if (response.status === HttpStatus.CONFLICT) {
      throw new ConflictException('Username already exists');
    }
    throw new ApiException('Failed to update profile', response.status);
  }

  return response.json();
};

export const getAllUsersAction = async (): Promise<User[]> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    throw new UnauthorizedException('Not authenticated');
  }

  let response;
  try {
    response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        Cookie: `Authentication=${token}`,
      },
    });
  } catch (error) {
    throw new ServiceUnavailableException('Failed to fetch users');
  }

  if (!response.ok) {
    throw new ApiException('Failed to fetch users', response.status);
  }

  return response.json();
};

export const deleteUserAction = async (id: string): Promise<void> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    throw new UnauthorizedException('Not authenticated');
  }

  let response;
  try {
    response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: `Authentication=${token}`,
      },
    });
  } catch (error) {
    throw new ServiceUnavailableException('Failed to delete user');
  }

  if (!response.ok) {
    throw new ApiException('Failed to delete user', response.status);
  }
};
