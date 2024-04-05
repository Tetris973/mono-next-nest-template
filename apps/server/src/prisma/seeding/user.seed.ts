import { PrismaService } from '../prisma.service';

enum Users {
  tetris = 1,
  adrien,
  simon34,
  victor,
  testUser,
}

async function seedUsers(prisma: PrismaService) {
  const users = [
    {
      id: Users.tetris,
      username: Users[Users.tetris],
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
    {
      id: Users.adrien,
      username: Users[Users.adrien],
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
    {
      id: Users.simon34,
      username: Users[Users.simon34],
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
    {
      id: Users.victor,
      username: Users[Users.victor],
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
    {
      id: Users.testUser,
      username: Users[Users.testUser],
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
  ];

  for (const user of users) {
    const { id, ...userData } = user;
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: userData,
    });
    console.log(`User '${user.username}'`);
  }
  console.log('/// Users seeded. ///');
}

export { seedUsers, Users };
