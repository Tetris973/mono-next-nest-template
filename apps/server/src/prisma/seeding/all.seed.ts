import { PrismaService } from '@server/prisma/prisma.service';
// import { seedResources } from './resource.seed';
// import { seedPermissions } from './permission.seed';
import { seedUsers } from './user.seed';
import { seedUserRoleRelations } from './user-role.seed';
// import { seedRolePermission } from './role-permission.seed';
import { seedProduction } from './production/all.seed';

const prisma = new PrismaService();

async function main() {
  /**
   * Seed all production static data
   */
  await seedProduction(prisma);

  /**
   * Until permission, role-premission casl ability from database data or not used, then resources seeding is not needed
   */
  // console.log('--- Seeding Resources... ---');
  // await seedResources(prisma, true);

  // console.log('--- Seeding Permissions... ---');
  // await seedPermissions(prisma, true);

  console.log('--- Seeding Users... ---');
  await seedUsers(prisma, true);

  console.log('--- Seeding User-Role... ---');
  await seedUserRoleRelations(prisma, true);

  // console.log('--- Seeding Role-Permission... ---');
  // await seedRolePermission(prisma, true);

  console.log('--- All seeding completed successfully. ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
