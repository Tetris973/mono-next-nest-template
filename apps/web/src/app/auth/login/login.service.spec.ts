import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { loginAction, isAuthenticatedAction, getRolesAction } from './login.service';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { LoginUserDto } from '@dto/modules/user/dto/log-in-user.dto';
import { Role } from '@web/app/auth/role.enum';
import { cookies } from 'next/headers';
import { safeFetch } from '@web/common/helpers/safe-fetch.helpers';
import { jwtDecode } from 'jwt-decode';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

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
    it('should set auth cookie on successful login', async () => {
      // INIT
      const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('Authentication=token; Path=/; HttpOnly'),
        },
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });
      const exp1H = Date.now() + 3600000;
      (jwtDecode as Mock).mockReturnValue({ exp: exp1H });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      const SECONDS_TO_MILLISECONDS = 1000;
      expect(result).toEqual({ data: undefined });
      expect(mockCookies.set).toHaveBeenCalledWith({
        name: 'Authentication',
        value: 'token',
        secure: true, // Cookie must be secure, otherwise breach of security
        sameSite: 'strict',
        httpOnly: true, // Cookie must be httpOnly, otherwise breach of security
        expires: new Date(exp1H * SECONDS_TO_MILLISECONDS),
      });
    });

    it('should return fatal error if jwtDecode did not correclty decode the token', async () => {
      // INIT
      const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('Authentication=token; Path=/; HttpOnly'),
        },
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });
      (jwtDecode as Mock).mockReturnValue({ wrongData: 'wrongData' });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'An unexpected error occurred, please try again', status: HttpStatus.INTERNAL_SERVER_ERROR },
      });
    });

    it('should return fatal error if no Set-Cookie header', async () => {
      // INIT
      const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
      (safeFetch as Mock).mockResolvedValue({ data: { ok: true, headers: { get: vi.fn().mockReturnValue(null) } } });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'An unexpected error occurred, please try again', status: HttpStatus.INTERNAL_SERVER_ERROR },
      });
    });

    it('should return validation error on bad request', async () => {
      // INIT
      const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
      const mockResponse = {
        ok: false,
        status: HttpStatus.BAD_REQUEST,
        json: vi.fn().mockResolvedValue({ username: ['Username is required'] }),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: {
          message: 'Validation error',
          status: HttpStatus.BAD_REQUEST,
        },
        data: { username: ['Username is required'] },
      });
    });

    it('should return unauthorized error if password is incorrect', async () => {
      // INIT
      const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
      const resDto: DtoValidationError<LoginUserDto> = { password: ['Incorrect password'] };
      const mockResponse = {
        ok: false,
        status: HttpStatus.UNAUTHORIZED,
        json: vi.fn().mockResolvedValue(resDto),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'Unauthorized', status: HttpStatus.UNAUTHORIZED },
        data: resDto,
      });
    });

    it('should return unauthorized/not found error if username is not found', async () => {
      // INIT
      const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
      const resDto: DtoValidationError<LoginUserDto> = { username: ['User not found'] };
      const mockResponse = {
        ok: false,
        status: HttpStatus.NOT_FOUND,
        json: vi.fn().mockResolvedValue(resDto),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'Unauthorized', status: HttpStatus.NOT_FOUND },
        data: resDto,
      });
    });

    it('should return default error if unknown error', async () => {
      // INIT
      const loginData: LoginUserDto = { username: 'testUser', password: 'Chocolat123!' };
      const mockResponse = {
        ok: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        json: vi.fn().mockResolvedValue({}),
      };
      (safeFetch as Mock).mockResolvedValue({ data: mockResponse });

      // RUN
      const result = await loginAction(loginData);

      // CHECK RESULTS
      expect(result).toEqual({
        error: { message: 'An unexpected error occurred, please try again', status: HttpStatus.INTERNAL_SERVER_ERROR },
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
