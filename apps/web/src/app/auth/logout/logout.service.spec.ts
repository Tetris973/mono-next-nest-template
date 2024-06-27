import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { logoutAction } from './logout.service';
import { cookies } from 'next/headers';

describe('logout.service', () => {
  const mockCookies = {
    set: vi.fn(),
  };

  vi.mock('next/headers', () => ({
    cookies: vi.fn(),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    (cookies as Mock).mockReturnValue(mockCookies);
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
