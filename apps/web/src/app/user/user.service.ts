'use server';

import { API_URL } from '@web/app/constants/api';
import { cookies } from 'next/headers';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';
import { UserDto } from '@dto/user/dto/user.dto';

export const getUserByIdAction = async (id: number): Promise<UserDto | ActionErrorResponse> => {
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
    response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
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
};

export const updateUserAction = async (
  userId: number,
  updateUserDto: UpdateUserDto,
): Promise<UserDto | ActionErrorResponse> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    return {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Auth cookie missing, not authenticated',
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
      body: JSON.stringify(updateUserDto),
    });
  } catch (error) {
    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Service unavailable',
    };
  }

  if (!response.ok) {
    if (response.status === HttpStatus.CONFLICT) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Username already exists',
      };
    }
    return {
      status: response.status,
      message: 'Failed to update profile',
    };
  }

  return response.json();
};

export const getAllUsersAction = async (): Promise<UserDto[] | ActionErrorResponse> => {
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
    response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        Cookie: `Authentication=${token}`,
      },
    });
  } catch (error) {
    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Failed to fetch users',
    };
  }

  if (!response.ok) {
    return {
      status: response.status,
      message: 'Failed to fetch users',
    };
  }

  return response.json();
};

export const deleteUserAction = async (id: number): Promise<void | ActionErrorResponse> => {
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
    response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: `Authentication=${token}`,
      },
    });
  } catch (error) {
    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Failed to delete user',
    };
  }

  if (!response.ok) {
    return {
      status: response.status,
      message: 'Failed to delete user',
    };
  }
};