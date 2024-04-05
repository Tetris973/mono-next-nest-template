import { PrismaService } from '../prisma.service';
const prisma = new PrismaService();

import { seedUsers } from './user.seed';
import { seedResources } from './resource.seed';
import { seedPermissions } from './permission.seed';
import { seedRoles } from './role.seed';
import { seedUserRoleRelations } from './user-role.seed';
import { seedRolePermission } from './role-permission.seed';

async function main() {
  console.log('--- Seeding Resources... ---');
  await seedResources(prisma);

  console.log('--- Seeding Permissions... ---');
  await seedPermissions(prisma);

  console.log('--- Seeding Roles... ---');
  await seedRoles(prisma);

  console.log('--- Seeding Users... ---');
  await seedUsers(prisma);

  console.log('--- Seeding User-Role... ---');
  await seedUserRoleRelations(prisma);

  console.log('--- Seeding Role-Permission... ---');
  await seedRolePermission(prisma);

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
