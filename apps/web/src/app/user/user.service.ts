'use server';

import { API_URL } from '@web/app/constants/api';
import { cookies } from 'next/headers';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';
import { UserDto } from '@dto/user/dto/user.dto';
import { ActionResponse } from '@web/app/common/action-response.type';

export const getUserByIdAction = async (id: number): Promise<ActionResponse<UserDto>> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    return {
      error: {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Not authenticated',
      },
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
      error: {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Failed to connect to the server. Please try again later.',
      },
    };
  }

  if (!response.ok) {
    return {
      error: {
        status: response.status,
        message: 'Failed to fetch profile',
      },
    };
  }

  return { result: await response.json() };
};

export const updateUserAction = async (
  userId: number,
  updateUserDto: UpdateUserDto,
): Promise<ActionResponse<UserDto>> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    return {
      error: {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Auth cookie missing, not authenticated',
      },
    };
  }

  if (!userId) {
    return {
      error: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid token: user ID not found',
      },
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
      error: {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Failed to connect to the server. Please try again later.',
      },
    };
  }

  if (!response.ok) {
    if (response.status === HttpStatus.CONFLICT) {
      return {
        error: {
          status: HttpStatus.CONFLICT,
          message: 'Username already exists',
        },
      };
    }
    return {
      error: {
        status: response.status,
        message: 'Failed to update profile',
      },
    };
  }

  return { result: await response.json() };
};

export const getAllUsersAction = async (): Promise<ActionResponse<UserDto[]>> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    return {
      error: {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Not authenticated',
      },
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
      error: {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Failed to connect to the server. Please try again later.',
      },
    };
  }

  if (!response.ok) {
    return {
      error: {
        status: response.status,
        message: 'Failed to fetch users',
      },
    };
  }

  return { result: await response.json() };
};

export const deleteUserAction = async (id: number): Promise<ActionResponse<null>> => {
  const cookieStore = cookies();
  const token = cookieStore.get('Authentication')?.value;

  if (!token) {
    return {
      error: {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Not authenticated',
      },
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
      error: {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Failed to connect to the server. Please try again later.',
      },
    };
  }

  if (!response.ok) {
    return {
      error: {
        status: response.status,
        message: 'Failed to delete user',
      },
    };
  }

  return { result: null };
};
