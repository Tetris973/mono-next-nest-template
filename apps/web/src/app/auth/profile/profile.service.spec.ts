import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfileAction } from './profile.service';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { backendApi, StandardizedApiError, UserDto } from '@web/lib/backend-api/index';
import { ServerActionResponseErrorInfo } from '@web/common/types/server-action-response.type';

describe('profile.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfileAction', () => {
    it('should return user profile on successful fetch', async () => {
      // INIT
      const mockProfile: UserDto = {
        id: 1,
        username: 'testUser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(backendApi).authControllerGetProfile.mockResolvedValue(mockProfile);

      // RUN
      const result = await getProfileAction();

      // CHECK RESULTS
      expect(result).toEqual({ data: mockProfile });
      expect(backendApi.authControllerGetProfile).toHaveBeenCalled();
    });

    it('should handle StandardizedApiError and return error info', async () => {
      // INIT
      const mockErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      };
      const mockError = new StandardizedApiError(mockErrorInfo);
      vi.mocked(backendApi).authControllerGetProfile.mockRejectedValue(mockError);

      // RUN
      const result = await getProfileAction();

      // CHECK RESULTS
      expect(result).toEqual({ error: mockErrorInfo });
    });

    it('should handle unhandled errors and return a standard error message', async () => {
      // INIT
      const mockError = new Error('Unhandled error');
      vi.mocked(backendApi).authControllerGetProfile.mockRejectedValue(mockError);

      // RUN
      const result = await getProfileAction();

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch profile',
        },
      });
    });
  });
});
