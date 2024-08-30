'use server';

import { getConfig } from '@web/config/configuration';
import { UserDto } from '@dto/modules/user/dto/user.dto';
import { ActionResponse } from '@web/common/types/action-response.type';
import { safeFetch } from '@web/common/helpers/safe-fetch.helpers';
import { checkAuthentication } from '@web/common/helpers/check-authentication.helpers';

export async function getProfileAction(): Promise<ActionResponse<UserDto>> {
  const { result: token, error: authError } = checkAuthentication();
  if (authError) {
    return { error: authError };
  }

  const { result: response, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/auth/profile`, {
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
}
