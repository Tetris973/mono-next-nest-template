'use server';

import { getConfig } from '@web/config/configuration';
import { UserDto } from '@dto/user/dto/user.dto';
import { ActionResponse } from '@web/app/common/action-response.type';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';
import { checkAuthentication } from '@web/app/utils/check-authentication.utils';

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
