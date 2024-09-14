'use server';

import { ServerActionResponseDto } from '@web/common/types/server-action-response.type';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { backendApi, StandardizedApiError, ResponseError, CreateUserDto, UserDto } from '@web/lib/backend-api/index';
import { standardizeAndLogError } from '@web/common/helpers/unhandled-server-action-error.helper';
import { getLogger } from '@web/lib/logger';

const logger = getLogger('signup.service');

export const signupAction = async (createUserDto: CreateUserDto): Promise<ServerActionResponseDto<UserDto>> => {
  try {
    const user = await backendApi.authControllerSignup({ createUserDto });
    return { data: user };
  } catch (error: unknown) {
    if (error instanceof StandardizedApiError) return { error: error.uiErrorInfo };

    if (error instanceof ResponseError) {
      if (error.response.status === HttpStatus.CONFLICT) {
        return {
          error: {
            status: HttpStatus.CONFLICT,
            message: 'User already exists',
          },
          data: { username: ['User already exists'] },
        };
      }

      if (error.response.status === HttpStatus.BAD_REQUEST) {
        return {
          error: {
            status: HttpStatus.BAD_REQUEST,
            message: 'Invalid user data',
          },
          data: await error.response.json(),
        };
      }
    }

    return standardizeAndLogError('Failed to sign up', error, logger);
  }
};
