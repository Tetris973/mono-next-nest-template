import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { loginAction, isAuthenticatedAction, getRolesAction } from './login.service';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { Role } from '@web/app/auth/role.enum';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { backendApi, StandardizedApiError, ResponseError, LoginUserDto } from '@web/lib/backend-api/index';
import { getLogs, getLogger, LogLevel } from '@testWeb/common/unit-test/helpers/test-logger.helpers';
import { ServerActionResponseErrorInfo } from '@web/common/types/server-action-response.type';

describe('login.service', () => {
  const mockCookies = {
    set: vi.fn(),
    get: vi.fn(),
  };

  vi.mock('next/headers', () => ({
    cookies: vi.fn(),
  }));

  vi.mock('jwt-decode', () => {
    return {
      jwtDecode: vi.fn(),
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (cookies as Mock).mockReturnValue(mockCookies);
  });

  describe('loginAction', () => {
    const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };

    it('should set auth cookie on successful login', async () => {
      // INIT
      const mockResponse = {
        ok: true,
        raw: {
          headers: {
            get: vi.fn().mockReturnValue('Authentication=token; Path=/; HttpOnly'),
          },
        },
      };
      vi.mocked(backendApi.authControllerLoginRaw).mockResolvedValue(mockResponse as any);
      const exp1H = Math.floor(Date.now() / 1000) + 3600;
      (jwtDecode as Mock).mockReturnValue({ exp: exp1H });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({ data: undefined });
      expect(mockCookies.set).toHaveBeenCalledWith({
        name: 'Authentication',
        value: 'token',
        secure: true, // Cookie must be secure, otherwise breach of security
        sameSite: 'strict',
        httpOnly: true, // Cookie must be httpOnly, otherwise breach of security
        expires: new Date(exp1H * 1000),
      });
    });

    it('should return an error message and log fatal error when jwtDecode did not correctly decode the token', async () => {
      // INIT
      const mockResponse = {
        raw: {
          headers: {
            get: vi.fn().mockReturnValue('Authentication=token; Path=/; HttpOnly'),
          },
        },
      };
      vi.mocked(backendApi.authControllerLoginRaw).mockResolvedValue(mockResponse as any);
      vi.mocked(jwtDecode).mockReturnValue({ wrongData: 'wrongData' });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      const error = getLogs()[0] as { level: number; err: Error; msg: string };
      expect(error.level).toEqual(getLogger().levels.values[LogLevel.FATAL]);
      expect(error.err.message).toEqual('Token does not have an expiration date');
      expect(error.msg).toEqual('Error setting authentication cookie');

      expect(result).toEqual({
        error: { message: 'An unexpected error occurred, please try again', status: HttpStatus.INTERNAL_SERVER_ERROR },
      });
    });

    it('should return and error message and log fatal error when no Set-Cookie header found in the response', async () => {
      // INIT
      const mockResponse = {
        raw: {
          headers: {
            get: vi.fn().mockReturnValue(null),
          },
        },
      };
      vi.mocked(backendApi.authControllerLoginRaw).mockResolvedValue(mockResponse as any);

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      const error = getLogs()[0] as { level: number; err: Error; msg: string };
      expect(error.level).toEqual(getLogger().levels.values[LogLevel.FATAL]);
      expect(error.err.message).toEqual('No Set-Cookie header found in the response');
      expect(error.msg).toEqual('Error setting authentication cookie');

      expect(result).toEqual({
        error: { message: 'An unexpected error occurred, please try again', status: HttpStatus.INTERNAL_SERVER_ERROR },
      });
    });

    it('should handle StandardizedApiError', async () => {
      // INIT
      const mockErrorInfo: ServerActionResponseErrorInfo = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
      };
      const mockError = new StandardizedApiError(mockErrorInfo);
      vi.mocked(backendApi.authControllerLoginRaw).mockRejectedValue(mockError);

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: mockErrorInfo,
      });
    });

    it('should handle ResponseError for unauthorized access', async () => {
      // INIT
      const mockError = new ResponseError(new Response(JSON.stringify({}), { status: HttpStatus.UNAUTHORIZED }));
      vi.mocked(backendApi.authControllerLoginRaw).mockRejectedValue(mockError);

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'Unauthorized', status: HttpStatus.UNAUTHORIZED },
        data: { password: ['Incorrect password'] },
      });
    });

    it('should handle ResponseError for user not found', async () => {
      // INIT
      const mockError = new ResponseError(new Response(JSON.stringify({}), { status: HttpStatus.NOT_FOUND }));
      vi.mocked(backendApi.authControllerLoginRaw).mockRejectedValue(mockError);

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'Unauthorized', status: HttpStatus.NOT_FOUND },
        data: { username: ['User not found'] },
      });
    });

    it('should handle ResponseError for bad request', async () => {
      // INIT
      const mockErrorData = { username: ['Username is required'] };
      const mockError = new ResponseError(
        new Response(JSON.stringify(mockErrorData), { status: HttpStatus.BAD_REQUEST }),
      );
      vi.mocked(backendApi.authControllerLoginRaw).mockRejectedValue(mockError);

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'Validation error', status: HttpStatus.BAD_REQUEST },
        data: mockErrorData,
      });
    });

    it('should handle unhandled errors', async () => {
      // INIT
      const mockError = new Error('Unhandled error');
      vi.mocked(backendApi.authControllerLoginRaw).mockRejectedValue(mockError);

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to login' },
      });
    });
  });

  describe('isAuthenticatedAction', () => {
    it('should return true if authentication cookie is present', async () => {
      // INIT
      mockCookies.get.mockReturnValue({ value: 'token' });

      // RUN
      const result = await isAuthenticatedAction();

      // CHECK RESULTS
      expect(result).toBe(true);
    });

    it('should return false if authentication cookie is not present', async () => {
      // INIT
      mockCookies.get.mockReturnValue(undefined);

      // RUN
      const result = await isAuthenticatedAction();

      // CHECK RESULTS
      expect(result).toBe(false);
    });
  });

  describe('getRolesAction', () => {
    it('should return roles from decoded token', async () => {
      // INIT
      const roles: Role[] = [Role.USER, Role.ADMIN];
      (jwtDecode as Mock).mockReturnValue({ roles });

      mockCookies.get.mockReturnValue({ value: 'token' });

      // RUN
      const result = await getRolesAction();

      // CHECK RESULTS
      expect(result).toEqual(roles);
    });

    it('should return empty array if no token is present', async () => {
      // INIT
      mockCookies.get.mockReturnValue(undefined);

      // RUN
      const result = await getRolesAction();

      // CHECK RESULTS
      expect(result).toEqual([]);
    });

    it('should return empty array on invalid token', async () => {
      // INIT
      (jwtDecode as Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      mockCookies.get.mockReturnValue({ value: 'token' });

      // RUN
      const result = await getRolesAction();

      // CHECK RESULTS
      expect(result).toEqual([]);
    });
  });
});
