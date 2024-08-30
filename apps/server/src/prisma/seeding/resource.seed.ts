import { PrismaService } from '@server/prisma/prisma.service';
import { StaticResources } from '@server/authz/static-resources.enum';

async function seedResources(prisma: PrismaService, doLog: boolean = false) {
  for (const enumMember in StaticResources) {
    // Check if its the index of the enumMember instead of the key
    const enumIndex = parseInt(enumMember, 10);
    const isKey = Number.isNaN(enumIndex);
    if (!isKey) {
      const id = enumIndex;
      const name = StaticResources[enumMember];

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
