import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
// TODO: replace this with a real entity class from Prisma
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: '$2b$10$B/4yfVILWji1BYE3nH.XQudsJtZY5CWN185QMcfuzhPlSNcftdleC',
    },
    {
      userId: 2,
      username: 'maria',
      password: '$2b$10$OsvQBaOwam2CWPtee/KfoevNi8rxJbWwCDNjzPnwM2GWkHFmqvzwa',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
