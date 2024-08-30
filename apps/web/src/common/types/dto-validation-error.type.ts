/**
 * DTO validation error type
 *
 * This type represents a validation error for a Data Transfer Object (DTO).
 * It maps each property of the DTO to an array of error messages.
 *
 * @template T - The DTO type
 *
 * @example
 * // Given a DTO type
 * type UserDto = {
 *   username: string;
 *   age: number;
 *   isAdmin: boolean;
 * };
 *
 * // The DtoValidationError type for UserDto would be:
 *  {
 *    username?: string[];
 *    age?: string[];
 *    isAdmin?: string[];
 *  }
 *
 */
export type DtoValidationError<T> = Partial<{ [K in keyof T]: string[] }>;
