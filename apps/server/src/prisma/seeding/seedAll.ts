import { PrismaService } from '../prisma.service';
const prisma = new PrismaService();

import { seedUsers } from './seedUsers';

async function main() {
  console.log('Seeding users...');
  await seedUsers(prisma);

  console.log('All seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
