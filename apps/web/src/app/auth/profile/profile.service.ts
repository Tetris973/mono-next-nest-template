'use server';

import { getConfig } from '@web/config/configuration';
import { UserDto } from '@dto/modules/user/dto/user.dto';
import { ServerActionResponse } from '@web/common/types/action-response.type';
import { safeFetch } from '@web/common/helpers/safe-fetch.helpers';
import { checkAuthentication } from '@web/common/helpers/check-authentication.helpers';

export async function getProfileAction(): Promise<ServerActionResponse<UserDto>> {
  const { data: token, error: authError } = checkAuthentication();
  if (authError) {
    return { error: authError };
  }

  const { data: response, error: fetchError } = await safeFetch(`${getConfig().BACKEND_URL}/auth/profile`, {
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

  return { data: await response.json() };
}
