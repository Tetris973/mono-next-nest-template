'use server';

import { ServerActionResponse } from '@web/common/types/server-action-response.type';
import { backendApi, StandardizedApiError, UserDto } from '@web/lib/backend-api/index';
import { standardizeAndLogError } from '@web/common/helpers/unhandled-server-action-error.helper';
import { getLogger } from '@web/lib/logger';

const logger = getLogger('profile.service');

export async function getProfileAction(): Promise<ServerActionResponse<UserDto>> {
  try {
    const profile = await backendApi.authControllerGetProfile();
    return { data: profile };
  } catch (error: unknown) {
    if (error instanceof StandardizedApiError) return { error: error.uiErrorInfo };
    return standardizeAndLogError('Failed to fetch profile', error, logger);
  }
}
