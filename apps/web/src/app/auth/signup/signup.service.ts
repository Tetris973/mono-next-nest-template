'use server';
import { ActionResponse } from '@web/app/common/action-response.type';
import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';

export const signupAction = async (createUserDto: CreateUserDto): Promise<ActionResponse<null>> => {
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
      return { error: { message: 'User already exists', status: HttpStatus.CONFLICT } };
    }
    return { error: { message: 'Failed to sign up', status: res.status } };
  }

  return { result: null };
};
