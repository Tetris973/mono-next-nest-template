import { PrismaService } from '../prisma.service';
import { Users } from './user.seed';
import { BaseRoles } from '@server/authz/baseRoles.enum';

async function seedUserRoleRelations(prisma: PrismaService, doLog: boolean = false) {
  const userRole = [
    {
      userId: Users.tetris,
      roleId: BaseRoles.ADMIN,
    },
    {
      userId: Users.adrien,
      roleId: BaseRoles.USER,
    },
    {
      userId: Users.simon34,
      roleId: BaseRoles.USER,
    },
    {
      userId: Users.victor,
      roleId: BaseRoles.USER,
    },
    {
      userId: Users.testUser,
      roleId: BaseRoles.USER,
    },
  ];

  for (const relation of userRole) {
    // Use the following because upsert does not work with composite keys
    const existingRelation = await prisma.userRole.findFirst({
      where: {
        userId: relation.userId,
        roleId: relation.roleId,
      },
    });

    if (existingRelation) {
      await prisma.userRole.update({
        where: { id: existingRelation.id },
        data: {},
      });
    } else {
      await prisma.userRole.create({
        data: {
          user: { connect: { id: relation.userId } },
          role: { connect: { id: relation.roleId } },
        },
      });
    }

    if (doLog) console.log(`User '${Users[relation.userId]}' Role '${BaseRoles[relation.roleId]}'`);
  }
  if (doLog) console.log('/// User-Role seeded. ///');
}

export { seedUserRoleRelations, Users };
