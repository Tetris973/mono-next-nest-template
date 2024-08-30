/**
 * Interface representing the payload of a JWT.
 */
export interface IJwtPayload {
  /**
   * Subject identifier. This is usually the user ID.
   */
  sub: number;

  /**
   * Roles assigned to the user.
   */
  roles: string[];
}
