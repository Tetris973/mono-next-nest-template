import { PrismaService } from '../prisma.service';
import { BaseRoles } from '@server/authz/baseRoles.enum';

async function seedRoles(prisma: PrismaService) {
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

      console.log(`Role '${name}'`);
    }
  }

  console.log('/// Roles seeded. ///');
}

export { seedRoles };
