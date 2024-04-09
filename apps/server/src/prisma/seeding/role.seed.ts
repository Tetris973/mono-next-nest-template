import { PrismaService } from '../prisma.service';
import { BaseRoles } from '@server/authz/baseRoles.enum';

async function seedRoles(prisma: PrismaService, doLog: boolean = false) {
  for (const enumMember in BaseRoles) {
    // Check if its the index of the enumMember instead of the key
    const enumIndex = parseInt(enumMember, 10);
    const isKey = Number.isNaN(enumIndex);
    if (!isKey) {
      const id = enumIndex;
      const name = BaseRoles[enumMember];

      await prisma.role.upsert({
        where: { id: id },
        update: {},
        create: {
          name: name,
        },
      });

      if (doLog) console.log(`Role '${name}'`);
    }
  }

  if (doLog) console.log('/// Roles seeded. ///');
}

export { seedRoles };
