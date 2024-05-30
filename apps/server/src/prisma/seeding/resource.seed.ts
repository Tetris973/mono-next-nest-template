import { PrismaService } from '../prisma.service';
import { BaseResources } from '@server/authz/baseResources.enum';

async function seedResources(prisma: PrismaService, doLog: boolean = false) {
  for (const enumMember in BaseResources) {
    // Check if its the index of the enumMember instead of the key
    const enumIndex = parseInt(enumMember, 10);
    const isKey = Number.isNaN(enumIndex);
    if (!isKey) {
      const id = enumIndex;
      const name = BaseResources[enumMember];

      await prisma.resource.upsert({
        where: { id },
        update: {},
        create: {
          name,
        },
      });

      if (doLog) console.log(`Resource '${name}'`);
    }
  }

  if (doLog) console.log('/// Resources seeded. ///');
}

export { seedResources };
