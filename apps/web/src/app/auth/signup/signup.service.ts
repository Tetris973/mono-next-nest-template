'use server';
import { ActionResponse } from '@web/app/common/action-response.type';
import { getConfig } from '@web/config/configuration';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';

export const signupAction = async (
  createUserDto: CreateUserDto,
): Promise<ActionResponse<CreateUserDto, CreateUserDto>> => {
  const { result: res, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createUserDto),
  });

  if (fetchError) {
    return { error: fetchError };
  }

  if (!res.ok) {
    if (res.status === HttpStatus.CONFLICT) {
      return {
        error: {
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
          details: { username: ['User already exists'] },
        },
      };
    }
    if (res.status === HttpStatus.BAD_REQUEST) {
      return {
        error: {
          message: 'Bad request',
          status: res.status,
          details: await res.json(),
        },
      };
    }
    return { error: { message: 'Failed to sign up', status: res.status } };
  }

  // Empty userDto as, backend returns 204 no content on success for the moment
  const userDto = await res.json();
  return { result: userDto };
};
