/**
 * Enum representing different roles within the system.
 * These roles are used for defining different levels of access and permissions.
 * The numerical values of the enum members start from 1, used for seeding in predictable order in the database.
 *
 * @enum {number}
 */
export enum StaticRoles {
  /**
   * Standard user role, corresponds to index 1 in the database.
   */
  USER = 1,

  /**
   * Administrator role, follows USER in the numerical sequence.
   */
  ADMIN,
}
