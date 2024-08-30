import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ResourceType } from './casl-ability.factory/casl-ability.factory';
import { Action } from '@prisma/client';

/**
 * This file is not moved to the general common/decorators folders because it is deeply coupled with permisions guard
 * that is also deeply coupled with casl ability library.
 * It is better to colocate it with the guard and the authz module.
 */

/** Tuple representing a required permission */
export type RequiredPermission = [Action, ResourceType];

/** Metadata key for permission checker */
export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';

/**
 * Decorator to check permissions for a route
 * @param params Array of required permissions
 * @returns Decorator function
 */
export const CheckPermissions = (...params: RequiredPermission[]): CustomDecorator<string> =>
  SetMetadata(PERMISSION_CHECKER_KEY, params);
