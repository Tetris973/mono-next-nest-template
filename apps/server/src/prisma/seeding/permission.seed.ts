import { PrismaService } from '@server/prisma/prisma.service';
import { Action } from '@prisma/client';
import { StaticResources } from '@server/authz/static-resources.enum';

enum Permissions {
  USER_MANAGE = 1, // To set the start of the enum to 1
  USER_CREATE,
  USER_READ,
  USER_UPDATE,
  USER_UPDATE_OWN,
  USER_DELETE,
}

async function seedPermissions(prisma: PrismaService, doLog: boolean = false) {
  const permissions = [
    {
      id: Permissions.USER_MANAGE,
      action: Action.manage,
      resourceId: StaticResources.USER,
    },
    {
      id: Permissions.USER_CREATE,
      action: Action.CREATE,
      resourceId: StaticResources.USER,
    },
    {
      id: Permissions.USER_READ,
      action: Action.READ,
      resourceId: StaticResources.USER,
    },
    {
      id: Permissions.USER_UPDATE,
      action: Action.UPDATE,
      resourceId: StaticResources.USER,
    },
    {
      id: Permissions.USER_UPDATE_OWN,
      action: Action.UPDATE,
      resourceId: StaticResources.USER,
      condition: { id: '${userId}' },
    },
    {
      id: Permissions.USER_DELETE,
      action: Action.DELETE,
      resourceId: StaticResources.USER,
    },
  ];

  for (const perm of permissions) {
    const { id, ...permData } = perm;
    await prisma.permission.upsert({
      where: { id: perm.id },
      update: {},
      create: permData,
    });
    const conditionText = perm.condition ? perm.condition : '';
    const conditionKey = perm.condition ? 'condition' : '';
    if (doLog)
      console.log(
        `Permission Action '${perm.action}' on '${StaticResources[perm.resourceId]} `,
        conditionKey,
        conditionText,
      );
  }

  if (doLog) console.log('/// Permissions seeded. ///');
}

export { seedPermissions, Permissions };
