import { PrismaService } from '../prisma.service';

import { seedUsers } from './user.seed';
import { seedResources } from './resource.seed';
// import { seedPermissions } from './permission.seed';
import { seedRoles } from './role.seed';
import { seedUserRoleRelations } from './user-role.seed';
const prisma = new PrismaService();
// import { seedRolePermission } from './role-permission.seed';

async function main() {
  console.log('--- Seeding Resources... ---');
  await seedResources(prisma, true);

  // console.log('--- Seeding Permissions... ---');
  // await seedPermissions(prisma, true);

  console.log('--- Seeding Roles... ---');
  await seedRoles(prisma, true);

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
