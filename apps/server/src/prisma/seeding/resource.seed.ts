import { PrismaService } from '../prisma.service';
import { BaseResources } from '@server/authz/baseResources.enum';

async function seedResources(prisma: PrismaService) {
  for (const enumMember in BaseResources) {
    // Check if its the index of the enumMember instead of the key
    const enumIndex = parseInt(enumMember, 10);
    const isKey = Number.isNaN(enumIndex);
    if (!isKey) {
      const id = enumIndex;
      const name = BaseResources[enumMember];

      await prisma.resource.upsert({
        where: { id: id },
        update: {},
        create: {
          name: name,
        },
      });

      console.log(`Resource '${name}'`);
    }
  }

  console.log('/// Resources seeded. ///');
}

export { seedResources };
