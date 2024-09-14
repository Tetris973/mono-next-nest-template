import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logoutAction } from './logout.service';
import { cookies } from 'next/headers';

describe('logout.service', () => {
  const mockCookies = {
    set: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockReturnValue(mockCookies as any);
  });

  describe('logoutAction', () => {
    it('should clear the authentication cookie', async () => {
      // INIT
      const key = 'Authentication';
      const value = '';
      const cookie = {
        path: '/',
        expires: new Date(0),
      };

      // RUN
      await logoutAction();

      // CHECK RESULTS
      expect(mockCookies.set).toHaveBeenCalledWith(key, value, cookie);
    });
  });
});
