import { Role } from '@web/app/auth/role.enum';

/**
 * Interface representing the payload of a JWT.
 */
export interface JwtPayload {
  /**
   * Subject identifier. This is usually the user ID.
   */
  sub: number;

  /**
   * Expiration time in seconds. This is a Unix timestamp indicating when the token will expire.
   */
  exp: number;

  /**
   * Issued at time in seconds. This is a Unix timestamp indicating when the token was issued.
   */
  iat: number;

  /**
   * Roles assigned to the user.
   */
  roles: Role[];
}
