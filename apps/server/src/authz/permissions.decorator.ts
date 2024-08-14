import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ResourceType } from './casl-ability.factory/casl-ability.factory';
import { Action } from '@prisma/client';

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
