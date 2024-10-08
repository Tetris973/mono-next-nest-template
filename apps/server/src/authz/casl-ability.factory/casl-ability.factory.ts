import { Injectable } from '@nestjs/common';
import { PureAbility, AbilityBuilder, ForcedSubject } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { AuthzService } from '@server/authz/authz.service';
import { User, Action } from '@prisma/client';
import { StaticResources } from '@server/authz/static-resources.enum';
import { StaticRoles } from '@server/authz/static-roles.enum';

// ResourceType and AppSubject should be in sync, similar type defined in both
// Auto define as Type of the resources available for casl authorization checking
export type ResourceType = keyof typeof StaticResources;
// Here define the subjects availabe for casl authorization checking
type AppSubjects = Subjects<{
  USER: User;
}>;

export type AppAbility = PureAbility<[Action, AppSubjects | ForcedSubject<AppSubjects> | 'all'], PrismaQuery>;

interface CaslPermission {
  action: Action;
  subject: string;
  condition?: PrismaQuery<AppSubjects>;
}

export type PermissionCondition = Record<string, any>;

/**
 * Recursively parse a condition object and replace placeholders with actual values
 * @param condition - The condition object from database (so normaly a JSON object) to parse
 * @param variables - The variables object to use for replacing placeholders
 * @returns The parsed condition object with all placeholders replaced
 * @example parseCondition({ id: '${userId}' }, { userId: 1 }) => { id: 1 }
 */
function parseCondition(
  condition: PermissionCondition,
  variables: Record<string, any>,
): PermissionCondition | undefined {
  if (!condition) return undefined;
  const parsedCondition: PermissionCondition = {};

  // Iterate over each key-value pair in the condition
  for (const [key, rawValue] of Object.entries(condition)) {
    // If the value is an object and not null, recurse to parse nested conditions
    if (rawValue !== null && typeof rawValue === 'object') {
      const value = parseCondition(rawValue, variables);
      parsedCondition[key] = value;
      continue;
    }

    // If the value is not a string, directly assign it to the parsed condition
    if (typeof rawValue !== 'string') {
      parsedCondition[key] = rawValue;
      continue;
    }

    // Check if the value is a string that matches the placeholder pattern '${variable}'
    const matches = /^\${([a-zA-Z0-9]+)}$/.exec(rawValue);
    // If no placeholders are found, assign the value directly
    if (!matches) {
      parsedCondition[key] = rawValue;
      continue;
    }

    // Retrieve the corresponding value from the variables object using the extracted variable name
    const value = variables[matches[1]];
    // Throw an error if the variable is not defined in the variables object
    if (typeof value === 'undefined') {
      throw new ReferenceError(`Variable ${matches[1]} is not defined`);
    }

    // Replace the placeholder with the actual value from the variables object
    parsedCondition[key] = value;
  }

  // Return the parsed condition with all placeholders replaced
  return parsedCondition;
}

@Injectable()
export class CaslAbilityFactory {
  constructor(private authzService: AuthzService) {}

  // TODO: disable database call if not used, as this slows down the app for feature not needed
  // TODO: add caching for the permissions if using permissions from database
  async createForUser(user: User): Promise<AppAbility> {
    const dbPermissions = await this.authzService.findAllPermissionsOfUser(user);
    const caslPermissions: CaslPermission[] = dbPermissions.map((p) => ({
      action: p.action,
      subject: p.resourceName,
      condition: parseCondition(p.condition as PermissionCondition, {
        // Define here the variables that will be used to replace placeholders in the conditions
        // Those variables must be used in the condition in the database as placeholders like '${userId}'
        userId: user.id,
      }),
    }));

    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    // Iterate over each permission from database and assign it to the ability of the user
    caslPermissions.forEach((permission) => {
      if (permission.condition) {
        can(permission.action, permission.subject as ResourceType, permission.condition);
      } else {
        can(permission.action, permission.subject as ResourceType);
      }
    });

    const roles = await this.authzService.findAllRolesOfUser(user);

    // Here is where the hardCoded permissions are defined
    // Iterate over each role of the user and assign permissions based on the role
    roles.forEach((role) => {
      switch (StaticRoles[role.name as keyof typeof StaticRoles]) {
        case StaticRoles.ADMIN:
          can(Action.manage, 'all');
          break;
        case StaticRoles.USER:
          can(Action.READ, 'all');
          can(Action.UPDATE, 'USER', { id: user.id });
          break;
      }
    });

    const ability = build();
    return ability;
  }
}
