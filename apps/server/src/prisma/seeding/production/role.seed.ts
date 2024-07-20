import { PrismaService } from '@server/prisma/prisma.service';
import { BaseRoles } from '@server/authz/baseRoles.enum';

async function seedRoles(prisma: PrismaService, doLog: boolean = false) {
  for (const enumMember in BaseRoles) {
    const enumIndex = parseInt(enumMember, 10);
    const isBaseRoleId = !Number.isNaN(enumIndex);
    if (isBaseRoleId) {
      const id = enumIndex;
      const name = BaseRoles[enumMember];

      try {
        const existingRole = await prisma.role.findUnique({
          where: { name },
        });

        if (existingRole) {
          if (existingRole.id !== id) {
            throw new Error(`Role '${name}' exists but with a different id (${existingRole.id}). Expected id: ${id}`);
          }
          if (doLog) console.log(`Role '${name}' already exists with correct id ${id}.`);
        } else {
          await prisma.role.create({
            data: { id, name },
          });
          if (doLog) console.log(`Role '${name}' created with id ${id}.`);
        }
      } catch (error) {
        console.error(`Error processing role '${name}':`, error);
        throw error; // Re-throw to stop the seeding process
      }
    }
  }

  if (doLog) console.log('/// Roles seeding completed. ///');
}

export { seedRoles };
