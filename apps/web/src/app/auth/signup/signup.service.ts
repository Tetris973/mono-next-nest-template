'use server';
import { ActionResponse } from '@web/app/common/action-response.type';
import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';

export const signupAction = async (
  createUserDto: CreateUserDto,
): Promise<ActionResponse<CreateUserDto, CreateUserDto>> => {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createUserDto),
    });
  } catch (error) {
    return { error: { message: 'Failed to connect to the server', status: HttpStatus.SERVICE_UNAVAILABLE } };
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
