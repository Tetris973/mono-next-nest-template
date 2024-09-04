'use server';
import { ServerActionResponseDto } from '@web/common/types/action-response.type';
import { getConfig } from '@web/config/configuration';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { CreateUserDto } from '@dto/modules/user/dto/create-user.dto';
import { safeFetch } from '@web/common/helpers/safe-fetch.helpers';

export const signupAction = async (createUserDto: CreateUserDto): Promise<ServerActionResponseDto<CreateUserDto>> => {
  const { data: res, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/auth/signup`, {
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
        },
        data: { username: ['User already exists'] },
      };
    }
    if (res.status === HttpStatus.BAD_REQUEST) {
      return {
        error: {
          message: 'Bad request',
          status: res.status,
        },
        data: await res.json(),
      };
    }
    return { error: { message: 'Failed to sign up', status: res.status } };
  }

  // Empty userDto as, backend returns 204 no content on success for the moment
  const userDto = await res.json();
  return { data: userDto };
};
