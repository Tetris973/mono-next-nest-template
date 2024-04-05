/**
 * Enum representing all available resources for authorization checks with CASL.
 * Each resource defined here should correspond to a resource in the database,
 * as CASL uses these definitions to apply authorization rules. The numerical values
 * of the enum members start from 1, aligning with the resource indices in the database.
 *
 * @enum {number}
 * @property {number} User - Represents the User resource, corresponds to index 1 in the database.
 */
export enum BaseResources {
  /**
   * User resource, corresponds to index 1 in the database.
   */
  User = 1,
}
