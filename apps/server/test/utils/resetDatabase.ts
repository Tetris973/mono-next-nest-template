import { Prisma } from '@prisma/client';
import { TestPrismaService } from './testPrisma.service';

export async function resetDatabase() {
  // Check if NODE_ENV is set to 'test'
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      `resetDatabase can only be executed in the test environment. You tried to execute it in the ${process.env.NODE_ENV} environment.`,
    );
  }

  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set. Prisma must be mocked!');
    return;
  }

  const tableNames = Object.values(Prisma.ModelName);
  const prisma = TestPrismaService.getInstance();

  for (const tableName of tableNames) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);
  }
}
