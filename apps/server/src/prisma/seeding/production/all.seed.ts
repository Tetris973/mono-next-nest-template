import { PrismaService } from '@server/prisma/prisma.service';
import { seedRoles } from './role.seed';

const prisma = new PrismaService();

export async function seedProduction(prisma: PrismaService) {
  console.log('--- Seeding static production data... ---');
  console.log('--- Seeding Roles... ---');
  await seedRoles(prisma, true);
  console.log('--- All static production data seeded. ---');
}

async function main() {
  await seedProduction(prisma);
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
