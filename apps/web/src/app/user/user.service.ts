'use server';

import { HttpStatus } from '@web/common/enums/http-status.enum';
import { ServerActionResponse } from '@web/common/types/server-action-response.type';
import { backendApi, StandardizedApiError, ResponseError, UpdateUserDto, UserDto } from '@web/lib/backend-api/index';
import { standardizeAndLogError } from '@web/common/helpers/unhandled-server-action-error.helper';
import { getLogger } from '@web/lib/logger';

const logger = getLogger('user.service');

export const getUserByIdAction = async (id: number): Promise<ServerActionResponse<UserDto>> => {
  try {
    const user = await backendApi.userControllerFindOne({ id: id.toString() });
    return { data: user };
  } catch (error: unknown) {
    if (error instanceof StandardizedApiError) return { error: error.uiErrorInfo };
    return standardizeAndLogError('Failed to fetch user', error, logger);
  }
};

export const updateUserAction = async (
  userId: number,
  updateUserDto: UpdateUserDto,
): Promise<ServerActionResponse<UserDto>> => {
  try {
    const updatedUser = await backendApi.userControllerUpdate({
      id: userId.toString(),
      updateUserDto,
    });
    return { data: updatedUser };
  } catch (error: unknown) {
    if (error instanceof StandardizedApiError) return { error: error.uiErrorInfo };

    if (error instanceof ResponseError) {
      if (error.response.status === HttpStatus.CONFLICT) {
        return {
          error: {
            status: HttpStatus.CONFLICT,
            message: 'Username already exists',
          },
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

    return standardizeAndLogError('Failed to update user', error, logger);
  }
};

export const getAllUsersAction = async (): Promise<ServerActionResponse<UserDto[]>> => {
  try {
    const users = await backendApi.userControllerFindAll();
    return { data: users };
  } catch (error: unknown) {
    if (error instanceof StandardizedApiError) return { error: error.uiErrorInfo };
    return standardizeAndLogError('Failed to fetch users', error, logger);
  }
};

export const deleteUserAction = async (id: number): Promise<ServerActionResponse<undefined>> => {
  try {
    await backendApi.userControllerRemove({ id: id.toString() });
    return { data: undefined };
  } catch (error: unknown) {
    if (error instanceof StandardizedApiError) return { error: error.uiErrorInfo };
    return standardizeAndLogError('Failed to delete user', error, logger);
  }
};
