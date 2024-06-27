'use server';

import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { UpdateUserDto } from '@dto/user/dto/update-user.dto';
import { UserDto } from '@dto/user/dto/user.dto';
import { ActionResponse } from '@web/app/common/action-response.type';
import { checkAuthentication } from '../utils/check-authentication.utils';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';

export const getUserByIdAction = async (id: number): Promise<ActionResponse<UserDto>> => {
  const { result: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  const { result: response, error: fetchError } = await safeFetch(`${API_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      Cookie: `Authentication=${token}`,
    },
  });
  if (fetchError) {
    return { error: fetchError };
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
  const { result: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  if (!userId) {
    return {
      error: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid token: user ID not found',
      },
    };
  }

  const { result: response, error: fetchError } = await safeFetch(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      Cookie: `Authentication=${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateUserDto),
  });
  if (fetchError) {
    return { error: fetchError };
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
        message: 'Failed to update user',
      },
    };
  }

  return { result: await response.json() };
};

export const getAllUsersAction = async (): Promise<ActionResponse<UserDto[]>> => {
  const { result: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  const { result: response, error: fetchError } = await safeFetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      Cookie: `Authentication=${token}`,
    },
  });
  if (fetchError) {
    return { error: fetchError };
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
  const { result: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  const { result: response, error: fetchError } = await safeFetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Cookie: `Authentication=${token}`,
    },
  });
  if (fetchError) {
    return { error: fetchError };
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
