import { SetMetadata } from '@nestjs/common';

/** Key used to mark routes as public */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route as public, bypassing authentication
 * @returns Decorator function
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
