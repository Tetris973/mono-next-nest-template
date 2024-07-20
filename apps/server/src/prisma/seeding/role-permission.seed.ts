import { PrismaService } from '@server/prisma/prisma.service';
import { BaseRoles } from '@server/authz/baseRoles.enum';
import { Permissions } from './permission.seed';

async function seedRolePermission(prisma: PrismaService, doLog: boolean = false) {
  const rolePermission = [
    {
      roleId: BaseRoles.ADMIN,
      permissionId: Permissions.USER_MANAGE,
    },
    {
      roleId: BaseRoles.USER,
      permissionId: Permissions.USER_READ,
    },
  ];

  // The rolePermission above are already hardcoded in the cas-ability.factory
  // They serves only as example for eventual pemission to seed
  // const rolePermission: any = [];

  for (const relation of rolePermission) {
    // Use the following because upsert does not work with composite keys
    const existingRelation = await prisma.rolePermission.findFirst({
      where: {
        roleId: relation.roleId,
        permissionId: relation.permissionId,
      },
    });

    if (existingRelation) {
      await prisma.rolePermission.update({
        where: { id: existingRelation.id },
        data: {},
      });
    } else {
      await prisma.rolePermission.create({
        data: {
          permission: { connect: { id: relation.permissionId } },
          role: { connect: { id: relation.roleId } },
        },
      });
    }

    if (doLog) console.log(`Role '${BaseRoles[relation.roleId]} Permission '${Permissions[relation.permissionId]}''`);
  }
  if (doLog) console.log('/// Role-Permission seeded. ///');
}

export { seedRolePermission };
