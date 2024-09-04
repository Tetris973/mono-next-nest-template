'use server';

import { getConfig } from '@web/config/configuration';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { UpdateUserDto, UserDto } from '@web/common/dto/backend-index.dto';
import { ServerActionResponse } from '@web/common/types/server-action-response.type';
import { checkAuthentication } from '@web/common/helpers/check-authentication.helpers';
import { safeFetch } from '@web/common/helpers/safe-fetch.helpers';

export const getUserByIdAction = async (id: number): Promise<ServerActionResponse<UserDto>> => {
  const { data: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  const { data: response, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/users/${id}`, {
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
        message: 'Failed to fetch user',
      },
    };
  }

  return { data: await response.json() };
};

export const getUserByIdActionNew = async (id: number): Promise<ServerActionResponse<UserDto>> => {
  const { data: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  const { data: response, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/users/${id}`, {
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
        message: 'Failed to fetch user',
      },
    };
  }

  return { data: await response.json() };
};

export const updateUserAction = async (
  userId: number,
  updateUserDto: UpdateUserDto,
): Promise<ServerActionResponse<UserDto>> => {
  const { data: token, error } = checkAuthentication();
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

  const { data: response, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/users/${userId}`, {
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

  return { data: await response.json() };
};

export const getAllUsersAction = async (): Promise<ServerActionResponse<UserDto[]>> => {
  const { data: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  const { data: response, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/users`, {
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

  return { data: await response.json() };
};

export const deleteUserAction = async (id: number): Promise<ServerActionResponse<undefined>> => {
  const { data: token, error } = checkAuthentication();
  if (error) {
    return { error };
  }

  const { data: response, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/users/${id}`, {
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

  return { data: undefined };
};
