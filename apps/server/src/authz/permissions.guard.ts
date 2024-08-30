import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_CHECKER_KEY, RequiredPermission } from './permissions.decorator';
import { CaslAbilityFactory, AppAbility } from './casl-ability.factory/casl-ability.factory';

/**
 * This file is not moved to the general common/guards folders because it is deeply coupled with casl ability library.
 * It is better to colocate it with the decorator and the authz module.
 */

/**
 * Checks if the given ability allows the specified permission
 * @param ability The application ability
 * @param permission The required permission
 * @returns True if the permission is allowed, false otherwise
 */
function isAllowed(ability: AppAbility, permission: RequiredPermission): boolean {
  return ability.can(...permission);
}

/**
 * Guard to check permissions for route access
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  /**
   * Checks if the current user has the required permissions to access the route.
   * It retrieves all permissions for the user and compares them against every
   * permission requirement defined by the @CheckPermissions decorator.
   * @param context The execution context
   * @returns A promise resolving to true if access is allowed, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(PERMISSION_CHECKER_KEY, context.getHandler()) || [];
    // Skip if permission decorator not used
    if (!requiredPermissions) return true;

    const req = context.switchToHttp().getRequest();
    const { user } = req;
    const ability = await this.abilityFactory.createForUser(user);
    return requiredPermissions.every((permission) => isAllowed(ability, permission));
  }
}
