import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getProfileAction } from './profile.service';
import { getConfig } from '@web/config/configuration';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';
import { checkAuthentication } from '@web/app/utils/check-authentication.utils';
import { UserDto } from '@dto/user/dto/user.dto';
import { HttpStatus } from '@web/app/common/http-status.enum';

describe('profile.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfileAction', () => {
    it('should return profile data on successful fetch', async () => {
      // INIT
      const mockToken = 'mockToken';
      const mockProfile: UserDto = {
        id: 1,
        username: 'testUser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockProfile),
      };
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await getProfileAction();

      // CHECK RESULTS
      expect(result).toEqual({ result: mockProfile });
      expect(safeFetch).toHaveBeenCalledWith(`${getConfig().BACKEND_URL}/auth/profile`, {
        headers: {
          Cookie: `Authentication=${mockToken}`,
        },
      });
    });

    it('should return error if response is not ok', async () => {
      // INIT
      const mockToken = 'mockToken';
      const mockResponse = {
        ok: false,
        status: HttpStatus.NOT_FOUND,
        json: vi.fn().mockResolvedValue({}),
      };
      (checkAuthentication as Mock).mockReturnValue({ result: mockToken });
      (safeFetch as Mock).mockResolvedValue({ result: mockResponse });

      // RUN
      const result = await getProfileAction();

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.NOT_FOUND,
          message: 'Failed to fetch profile',
        },
      });
    });
  });
});
