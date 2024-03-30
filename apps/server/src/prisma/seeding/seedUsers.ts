import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

// array of username, to have the id number
const USERNAMES = {
  tetris: { id: 1, name: 'tetris' },
  adrien: { id: 2, name: 'adrien' },
  simon: { id: 3, name: 'simon34' },
  victor: { id: 4, name: 'victor' },
  testUser: { id: 5, name: 'testUser' },
};

async function seedUsers(prisma: PrismaService) {
  const users = [
    {
      username: USERNAMES.tetris.name,
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
      roles: [Role.ADMIN],
    },
    {
      username: USERNAMES.adrien.name,
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
      roles: [Role.USER],
    },
    {
      username: USERNAMES.simon.name,
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
      roles: [Role.USER],
    },
    {
      username: USERNAMES.victor.name,
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
      roles: [Role.USER],
    },
    {
      username: USERNAMES.testUser.name,
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
      roles: [Role.USER],
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  }

  console.log(`${users.length} users created.`);
}

export { seedUsers, USERNAMES };
