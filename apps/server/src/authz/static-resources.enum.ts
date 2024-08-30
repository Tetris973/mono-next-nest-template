/**
 * Enum representing all available resources for authorization checks with CASL.
 * Each resource defined here should correspond to a resource in the database,
 * as CASL uses these definitions to apply authorization rules. The numerical values
 * of the enum members start from 1, used for seeding in predictable order in the database.
 *
 * @enum {number}
 * @property {number} User - Represents the User resource, corresponds to index 1 in the database.
 */
export enum StaticResources {
  /**
   * User resource, corresponds to index 1 in the database.
   */
  User = 1,
}
