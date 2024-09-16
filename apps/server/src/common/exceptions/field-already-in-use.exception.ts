import { Prisma } from '@prisma/client';

class FieldAlreadyInUseException extends Error {
  override name = 'FieldAlreadyInUseException' as const;
  public readonly fieldName: string;
  public readonly fieldValue: any;

  constructor(fieldName: string, fieldValue: any) {
    const message = `${fieldName} ${fieldValue} is already in use.`;
    super(message);
    this.fieldName = fieldName;
    this.fieldValue = fieldValue;
  }

  /**
   * Extracts the field name and its value from a Prisma unique constraint error.
   *
   * @param error - The Prisma error object thrown when a unique constraint is violated.
   * @param data - The data object that was attempted to be inserted/updated, causing the error.
   * @returns An object containing the field name and its value that caused the unique constraint violation.
   *
   * @example
   * ```typescript
   * try {
   *   // Prisma operation that might throw a unique constraint error
   * } catch (error) {
   *   if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
   *     const { field, value } = FieldAlreadyInUseException.extractFieldAndValue(error, data);
   *     throw new FieldAlreadyInUseException(field, value);
   *   }
   *   throw error;
   * }
   * ```
   */
  static extractFieldAndValue(
    error: Prisma.PrismaClientKnownRequestError,
    data: Record<string, any>,
  ): { field: string; value: any } {
    const field = Array.isArray(error.meta?.target)
      ? error.meta.target[0]
      : (error.meta?.target as string) || 'unknown';
    return { field, value: data[field] ?? 'unknown' };
  }
}

export { FieldAlreadyInUseException };
