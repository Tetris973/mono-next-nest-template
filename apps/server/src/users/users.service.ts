import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
// TODO: replace this with a real entity class from Prisma
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'tetris973',
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
    {
      userId: 2,
      username: 'default-user',
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
