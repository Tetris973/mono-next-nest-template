'use server';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { API_URL } from '@web/app/constants/api';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';

export const signupAction = async (createUserDto: CreateUserDto): Promise<ActionErrorResponse | void> => {
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
    return { message: 'Failed to connect to the server', status: HttpStatus.SERVICE_UNAVAILABLE };
  }

  if (!res.ok) {
    if (res.status === HttpStatus.CONFLICT) {
      return { message: 'User already exists', status: HttpStatus.CONFLICT };
    }
    return { message: 'Failed to sign up', status: res.status };
  }
};
